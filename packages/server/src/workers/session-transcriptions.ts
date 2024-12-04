import 'dotenv/config';
import { sessionTranscriptionsQueue } from '@utils/redis';
import ffmpeg from 'fluent-ffmpeg';
import WhisperAPI from '@utils/whisper';
import { dbConnection } from '@databases/index';
import { connect } from 'mongoose';
import { tmpdir } from 'os';
import { join } from 'path';
import { ISession } from '@interfaces/session.interface';
import { TranscriptionStatus } from '@interfaces/state.interface';
import SessionService from '@services/session.service';

interface SessionTranscriptionsJob {
  session: {
    id: ISession['_id'];
    videoUrl: ISession['videoUrl'];
    slug: ISession['slug'];
    name: ISession['name'];
  };
}

const consumer = async () => {
  const queue = await sessionTranscriptionsQueue();
  queue.process(async (job) => {
    const { session } = job.data as SessionTranscriptionsJob;
    return processSessionTranscription(session);
  });
};

const processSessionTranscription = async (
  sessionPayload: SessionTranscriptionsJob['session'],
) => {
  const sessionService = new SessionService();

  const sessionObject = // @ts-ignore
    (await sessionService.get(sessionPayload.id.toString()))?.toObject();

  if (!sessionPayload.videoUrl || !sessionObject) {
    throw new Error('Session not found or no videoUrl');
  }
  try {
    await transcribeAudio(sessionPayload.videoUrl, sessionObject);
    console.log(
      `Transcription completed successfully for session: ${sessionObject._id}`,
    );
    return true;
  } catch (error) {
    await updateTranscriptionStatus(sessionObject, TranscriptionStatus.failed);
    throw error;
  }
};

const generateVtt = async (words: ISession['transcripts']['chunks']) => {
  // WebVTT header
  let vtt = 'WEBVTT\n\n';

  // Group words into subtitle segments (roughly 7 words per segment)
  const WORDS_PER_SEGMENT = 7;
  let currentSegment: typeof words = [];
  let segments: (typeof words)[] = [];

  words.forEach((word, index) => {
    currentSegment.push(word);
    if (
      currentSegment.length === WORDS_PER_SEGMENT ||
      index === words.length - 1
    ) {
      segments.push([...currentSegment]);
      currentSegment = [];
    }
  });

  // Generate VTT cues
  segments.forEach((segment, index) => {
    const startTime = segment[0].start;
    const endTime = segment[segment.length - 1].end;

    // Convert timestamps to VTT format (HH:MM:SS.mmm)
    const formatTime = (timeInSeconds: number) => {
      const hours = Math.floor(timeInSeconds / 3600);
      const minutes = Math.floor((timeInSeconds % 3600) / 60);
      const seconds = Math.floor(timeInSeconds % 60);
      const milliseconds = Math.floor((timeInSeconds % 1) * 1000);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    };

    // Add cue number, timestamp, and text
    vtt += `${index + 1}\n`;
    vtt += `${formatTime(startTime)} --> ${formatTime(endTime)}\n`;
    vtt += `${segment.map((w) => w.word).join(' ')}\n\n`;
  });

  return vtt;
};

const updateTranscriptionStatus = async (
  session: ISession,
  status: TranscriptionStatus,
) => {
  const sessionService = new SessionService();
  return sessionService.update(session._id.toString(), {
    ...session,
    transcripts: {
      ...session.transcripts,
      status,
    },
  });
};

async function transcribeAudio(
  streamUrl: string,
  session: ISession,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tempDir = tmpdir();
    const outputPath = join(tempDir, `${session._id.toString()}.mp3`);
    const sessionService = new SessionService();

    const ffmpegProcess = ffmpeg(streamUrl)
      .inputOptions([
        '-protocol_whitelist',
        'file,http,https,tcp,tls,crypto',
        '-analyzeduration',
        '20M',
        '-probesize',
        '20M',
      ])
      .audioBitrate('32k') // Very low bitrate
      .audioCodec('libmp3lame') // Use MP3 codec
      .audioFrequency(8000) // 16kHz audio frequency
      .audioChannels(1) // Mono audio
      .save(outputPath)
      .on('start', () => {
        console.log('FFmpeg started');
      })
      .on('stderr', (stderrLine) => {
        console.log('FFmpeg output:', stderrLine);
      })
      .on('error', (error) => {
        console.error('FFmpeg error:', error);
        reject(error);
      })
      .on('end', async () => {
        console.log('FFmpeg processing completed');
        try {
          const transcript = await WhisperAPI.transcribe(outputPath);
          const sessionObject = {
            ...session,
            transcripts: {
              ...session.transcripts,
              status: TranscriptionStatus.completed,
              text: transcript.text,
              lastSegmentTimestamp: 0,
              subtitleUrl: await generateVtt(transcript.words),
              chunks: transcript.words,
            },
          };
          console.log('sessionObject', sessionObject.transcripts?.status);
          const updatedSession = await sessionService.update(
            session._id.toString(),
            sessionObject,
          );
          console.log('Updated session:', updatedSession.transcripts?.status);
          resolve();
        } catch (err) {
          console.error('Transcription error:', err);
          reject(err);
        }
      });

    // Add cleanup for FFmpeg process
    process.on('exit', () => {
      if (ffmpegProcess) {
        ffmpegProcess.kill('SIGKILL');
      }
    });
  });
}

const init = async () => {
  try {
    if (!dbConnection.url) {
      throw new Error('Database URL is not configured');
    }

    await connect(dbConnection.url, {
      serverSelectionTimeoutMS: 5000,
    });

    const queue = await sessionTranscriptionsQueue();
    if (!queue) {
      throw new Error('Failed to initialize Redis queue');
    }

    await consumer();
  } catch (err) {
    console.error('Worker initialization failed with error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
    process.exit(1);
  }
};

// Add more detailed error handlers
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

init().catch((error) => {
  console.error('Fatal error during initialization:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

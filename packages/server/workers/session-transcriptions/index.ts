import 'dotenv/config';
import { sessionTranscriptionsQueue } from '@utils/redis';
import ffmpeg from 'fluent-ffmpeg';
import WhisperAPI from '@utils/ai.transcribes';
import { dbConnection } from '@databases/index';
import { connect } from 'mongoose';
import { tmpdir } from 'os';
import { join } from 'path';
import { ISession } from '@interfaces/session.interface';
import { TranscriptionStatus } from '@interfaces/state.interface';
import SessionService from '@services/session.service';
import Session from '@models/session.model';
import fs from 'fs';
import path from 'path';
import { ChatAPI } from '@utils/ai.chat';
interface SessionTranscriptionsJob {
  session: {
    id: ISession['_id'];
    videoUrl: ISession['videoUrl'];
    slug: ISession['slug'];
    name: ISession['name'];
  };
}

const consumer = async () => {
  console.log('🎙️ Starting session transcriptions worker...');
  const queue = await sessionTranscriptionsQueue();
  queue.process(async (job) => {
    const { session } = job.data as SessionTranscriptionsJob;
    console.log('📋 Processing transcription job:', {
      sessionId: session.id,
      sessionName: session.name,
      timestamp: new Date().toISOString()
    });
    
    try {
      return processSessionTranscription(session);
    } catch (error) {
      console.error('❌ Error processing session transcription:', {
        sessionId: session.id,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    }
  });
};

const processSessionTranscription = async (
  sessionPayload: SessionTranscriptionsJob['session'],
) => {
  console.log('🔄 Starting session transcription process:', {
    sessionId: sessionPayload.id,
    sessionName: sessionPayload.name,
    timestamp: new Date().toISOString()
  });

  const sessionService = new SessionService();
  console.log('🔍 Fetching session details...');
  const sessionObject = // @ts-ignore
    (await sessionService.get(sessionPayload.id.toString()))?.toObject();

  if (!sessionPayload.videoUrl || !sessionObject) {
    console.error('❌ Invalid session data:', {
      sessionId: sessionPayload.id,
      hasUrl: !!sessionPayload.videoUrl,
      hasSession: !!sessionObject,
      timestamp: new Date().toISOString()
    });
    throw new Error('Session not found or no videoUrl');
  }

  try {
    console.log('🎬 Starting audio transcription:', {
      sessionId: sessionPayload.id,
      videoUrl: sessionPayload.videoUrl,
      timestamp: new Date().toISOString()
    });

    await transcribeAudio(sessionPayload.videoUrl, sessionObject);
    console.log('✅ Transcription completed successfully:', {
      sessionId: sessionObject._id,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('❌ Transcription failed:', {
      sessionId: sessionObject._id,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
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

const splitAudioIntoChunks = async (
  inputPath: string,
  maxChunkSize: number = 5 * 1024 * 1024 // Reduced to 5MB to be safe
): Promise<string[]> => {
  const tempDir = tmpdir();
  const chunkPaths: string[] = [];
  
  // Get audio duration
  const duration = await new Promise<number>((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata.format.duration || 0);
    });
  });

  // Calculate chunk duration based on file size and total duration
  const stats = await fs.promises.stat(inputPath);
  console.log('stats', stats.size);
  const numberOfChunks = Math.ceil(stats.size / maxChunkSize);
  console.log('numberOfChunks', numberOfChunks);
  const chunkDuration = duration / numberOfChunks;
  console.log('chunkDuration', chunkDuration);
  // Split into chunks
  for (let i = 0; i < numberOfChunks; i++) {
    const startTime = i * chunkDuration;
    const chunkPath = join(tempDir, `chunk_${i}_${path.basename(inputPath)}`);
    
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(chunkDuration)
        .audioCodec('libmp3lame')
        .audioBitrate('16k') // Lower bitrate for smaller file size
        .audioChannels(1)    // Mono audio
        .audioFrequency(8000) // 16kHz sample rate
        .output(chunkPath)
        .on('end', () => resolve())
        .on('error', reject)
        .run();
    });

    // Verify chunk size
    const chunkStats = await fs.promises.stat(chunkPath);
    console.log('chunkStats', chunkStats.size);
    if (chunkStats.size > maxChunkSize) {
      console.warn(`Chunk ${i} is too large (${chunkStats.size} bytes). Recreating with lower quality...`);
      // If still too large, recreate with even lower quality
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .setStartTime(startTime)
          .setDuration(chunkDuration)
          .audioCodec('libmp3lame')
          .audioBitrate('16k')  // Even lower bitrate
          .audioChannels(1)
          .audioFrequency(8000) // Lower sample rate
          .output(chunkPath)
          .on('end', () => resolve())
          .on('error', reject)
          .run();
      });
    }
    
    chunkPaths.push(chunkPath);
  }

  return chunkPaths;
};

const mergeTranscripts = (chunks: any[]): any => {
  let offset = 0;
  const mergedWords = chunks.flatMap((chunk, index) => {
    // Adjust timestamps for each chunk
    const adjustedWords = chunk.words.map((word: any) => ({
      ...word,
      start: word.start + offset,
      end: word.end + offset
    }));
    
    // Update offset for next chunk
    if (chunks[index + 1]) {
      const lastWord = chunk.words[chunk.words.length - 1];
      offset += lastWord.end;
    }
    
    return adjustedWords;
  });

  return {
    text: chunks.map(chunk => chunk.text).join(' '),
    words: mergedWords
  };
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const transcribeWithRetry = async (chunkPath: string, retries = 3, delay = 1000) => {
  // Add size verification before attempting transcription
  const stats = await fs.promises.stat(chunkPath);
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (stats.size > maxSize) {
    throw new Error(`File size (${stats.size} bytes) exceeds Whisper's limit of ${maxSize} bytes`);
  }

  for (let i = 0; i < retries; i++) {
    try {
      return await WhisperAPI.transcribe(chunkPath);
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying after ${delay}ms...`);
      await sleep(delay);
      delay *= 2; // Exponential backoff
    }
  }
};

export async function transcribeAudio(
  streamUrl: string,
  session: ISession,
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const tempDir = tmpdir();
    const outputPath = join(tempDir, `${session._id.toString()}.mp3`);

    const ffmpegProcess = ffmpeg(streamUrl)
      .inputOptions([
        '-protocol_whitelist',
        'file,http,https,tcp,tls,crypto',
        '-analyzeduration',
        '20M',
        '-probesize',
        '20M',
      ])
      .audioBitrate('16k') // Very low bitrate
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
          // Split audio into chunks
          const chunks = await splitAudioIntoChunks(outputPath);
          console.log(`Split audio into ${chunks.length} chunks`);

          // Transcribe chunks sequentially instead of in parallel
          const transcriptions = [];
          for (const [index, chunkPath] of chunks.entries()) {
            console.log(`Processing chunk ${index + 1}/${chunks.length}`);
            const transcription = await transcribeWithRetry(chunkPath);
            transcriptions.push(transcription);
            
            // Clean up chunk file after processing
            await fs.promises.unlink(chunkPath).catch(console.error);
          }

          // Merge transcriptions
          const mergedTranscript = mergeTranscripts(transcriptions);

          // Initialize AI chat and get summary
          console.log('Starting AI chat processing...');
          const aiChat = new ChatAPI();
          await aiChat.initializeSession(session._id.toString(), mergedTranscript.words);
          const summary = await aiChat.summarizeSession(session._id.toString(), mergedTranscript.text);
          console.log('AI chat processing completed');

          // Update session with merged transcript
          await Session.findByIdAndUpdate(
            session._id,
            {
              $set: {
                'transcripts.status': TranscriptionStatus.completed,
                'transcripts.text': mergedTranscript.text,
                'transcripts.lastSegmentTimestamp': 0,
                'transcripts.chunks': mergedTranscript.words,
                'transcripts.subtitleUrl': await generateVtt(mergedTranscript.words),
                'transcripts.summary': summary,
              }
            },
            { runValidators: false }
          );
          
          console.log('Session update completed');
          resolve();
        } catch (err) {
          console.error('Transcription error:', err);
          reject(err);
        } finally {
          // Clean up the original file
          fs.promises.unlink(outputPath).catch(console.error);
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
    console.log('🚀 Initializing session transcriptions worker...');
    
    if (!dbConnection.url) {
      console.error('❌ Database URL is not configured');
      throw new Error('Database URL is not configured');
    }

    console.log('🔌 Connecting to database...');
    await connect(dbConnection.url, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Database connected successfully');

    console.log('🔄 Initializing Redis queue...');
    const queue = await sessionTranscriptionsQueue();
    if (!queue) {
      console.error('❌ Failed to initialize Redis queue');
      throw new Error('Failed to initialize Redis queue');
    }
    console.log('✅ Redis queue initialized successfully');

    await consumer();
    console.log('✅ Worker initialization completed');
  } catch (err) {
    console.error('❌ Worker initialization failed:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    process.exit(1);
  }
};

// Add more detailed error handlers
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection in session transcriptions worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception in session transcriptions worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

init().catch((error) => {
  console.error('❌ Fatal error during session transcriptions worker initialization:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

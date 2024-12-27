import { stageTranscriptionsQueue } from '@utils/redis';
import ffmpeg from 'fluent-ffmpeg';
import StageService from '@services/stage.service';
import { buildPlaybackUrl } from '@utils/livepeer';
import WhisperAPI from '@utils/whisper';
import { IStage } from '@interfaces/stage.interface';
import { dbConnection } from '@databases/index';
import { connect } from 'mongoose';
import { tmpdir } from 'os';
import { join } from 'path';
import { promises as fs } from 'fs';
import { watch } from 'fs';
import { TranscriptionStatus } from '@interfaces/state.interface';
interface StageTranscriptionsJob {
  stageId: string;
}

const consumer = async () => {
  const queue = await stageTranscriptionsQueue();
  queue.process(async (job) => {
    const { stageId } = job.data as StageTranscriptionsJob;
    console.log('Processing job', stageId);
    
    return processStageTranscription(stageId);
  });
};

const processStageTranscription = async (stageId: string) => {
  const stageService = new StageService();
  // @ts-ignore
  const stage = (await stageService.get(stageId))?.toObject();

  if (!stage?.streamSettings.playbackId) {
    throw new Error('Stage not found or no playbackId');
  }

  if (!stage.streamSettings.isActive) {
    throw new Error('Stage is not active');
  }

  try {
    await transcribeAudio(
      buildPlaybackUrl(stage.streamSettings.playbackId),
      stage,
    );
    await updateTranscriptionStatus(stage, 'completed');
    return true;
  } catch (error) {
    await updateTranscriptionStatus(stage, 'failed');
    throw error;
  }
};

const updateTranscriptionStatus = async (
  stage: IStage,
  status: 'completed' | 'failed',
) => {
  const stageService = new StageService();
  return stageService.update(stage._id.toString(), {
    ...stage,
    transcripts: {
      ...stage.transcripts,
      status:
        status === 'completed'
          ? TranscriptionStatus.completed
          : TranscriptionStatus.failed,
    },
  });
};

async function transcribeAudio(
  streamUrl: string,
  stage: IStage,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tempDir = tmpdir();
    const outputPath = join(tempDir, `${stage._id.toString()}_segment_%d.mp3`);
    const stageService = new StageService();
    let chunks = [...(stage.transcripts?.chunks || [])];
    let text = stage.transcripts?.text || '';
    let lastSegmentTimestamp = stage.transcripts?.lastSegmentTimestamp || 0;
    let ffmpegProcess: any = null;
    console.log('lastSegmentTimestamp', stage.transcripts);
    const startFFmpeg = (startTime = 0) => {
      console.log(
        `Starting FFmpeg process with URL: ${streamUrl} at timestamp: ${startTime}`,
      );

      ffmpegProcess = ffmpeg(streamUrl)
        .inputOptions([
          '-re',
          '-protocol_whitelist',
          'file,http,https,tcp,tls,crypto',
          '-analyzeduration',
          '20M',
          '-probesize',
          '20M',
          '-fflags',
          '+igndts',
          '-live_start_index',
          '-1',
          '-loglevel',
          'info',
          '-stats',
          // Add seek option if we're restarting from a timestamp
          ...(startTime > 0 ? ['-ss', startTime.toString()] : []),
        ])
        .audioCodec('pcm_s16le')
        .audioBitrate('32k') // Very low bitrate
        .audioCodec('libmp3lame') // Use MP3 codec
        .audioFrequency(8000) // 16kHz audio frequency
        .audioChannels(1)
        .outputOptions([
          '-map',
          '0:a:0',
          '-f',
          'segment',
          '-segment_time',
          '10',
          '-reset_timestamps',
          '1',
          '-progress',
          'pipe:1',
        ])
        .save(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg started');
        })
        .on('stderr', (stderrLine) => {
          if (stderrLine.toLowerCase().includes('error')) {
            console.error('FFmpeg error:', stderrLine);
          }
        })
        .on('progress', (progress) => {
          const timemark = progress.timemark;
          if (typeof timemark === 'string' && timemark.includes(':')) {
            const [hours, minutes, seconds] = timemark.split(':').map(Number);
            lastSegmentTimestamp = hours * 3600 + minutes * 60 + seconds;
          } else {
            lastSegmentTimestamp = parseFloat(progress.timemark);
          }
        })
        .on('error', (error) => {
          console.error('FFmpeg error, attempting restart:', error);
          // Wait a bit before restarting
          if (!stage.streamSettings.isActive) {
            console.log('Stage is not active, skipping restart');
            return;
          }
          setTimeout(() => {
            if (lastSegmentTimestamp > 0) {
              startFFmpeg(lastSegmentTimestamp);
            }
          }, 5000);
        })
        .on('end', () => {
          console.log('FFmpeg processing completed');
          resolve();
        });

      return ffmpegProcess;
    };

    // Start initial FFmpeg process
    ffmpegProcess = startFFmpeg(lastSegmentTimestamp);

    const waitForFile = async (
      filePath: string,
      retries = 20,
      delay = 500,
    ): Promise<void> => {
      let lastSize = 0;
      for (let i = 0; i < retries; i++) {
        const stats = await fs.stat(filePath);
        if (stats.size === lastSize && stats.size > 0) {
          return;
        }
        lastSize = stats.size;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      throw new Error('File not stable after maximum retries');
    };

    const processSegment = async (filePath: string) => {
      try {
        const transcript = await WhisperAPI.transcribe(filePath);
        chunks = [...chunks, ...transcript.words];
        text = text + transcript.text;
        const stageObject = {
          ...stage,
          transcripts: {
            ...stage.transcripts,
            status: TranscriptionStatus.processing,
            lastSegmentTimestamp,
            chunks,
            text,
          },
        };
        await stageService.update(stage._id.toString(), stageObject);
      } catch (err) {
        console.error('Transcription error:', err);
        // Continue processing despite errors
      }
    };

    const watcher = watch(
      tempDir,
      async (eventType: 'rename' | 'change', filename: string) => {
        if (
          eventType === 'rename' &&
          filename.startsWith(`${stage._id.toString()}_segment_`)
        ) {
          const filePath = join(tempDir, filename);
          try {
            await waitForFile(filePath);
            console.log('New segment file:', filePath);
            console.log('File size:', (await fs.stat(filePath)).size);
            await processSegment(filePath);
          } catch (err) {
            console.error('Error processing segment:', err);
          }
        }
      },
    );

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
    console.log('Initializing stage transcriptions worker...');
    await connect(dbConnection.url);
    await consumer();
    console.log('Worker initialized successfully');
  } catch (err) {
    console.error('Worker initialization failed:', err);
    process.exit(1);
  }
};

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

init();

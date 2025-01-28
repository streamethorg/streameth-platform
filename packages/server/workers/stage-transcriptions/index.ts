import { stageTranscriptionsQueue } from '@utils/redis';
import ffmpeg from 'fluent-ffmpeg';
import StageService from '@services/stage.service';
import { buildPlaybackUrl } from '@utils/livepeer';
import WhisperAPI from '@utils/ai.transcribes';
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
  console.log('🎭 Starting stage transcriptions worker...');
  const queue = await stageTranscriptionsQueue();
  queue.process(async (job) => {
    const { stageId } = job.data as StageTranscriptionsJob;
    console.log('📋 Processing stage transcription:', {
      stageId,
      timestamp: new Date().toISOString()
    });
    
    return processStageTranscription(stageId);
  });
};

const processStageTranscription = async (stageId: string) => {
  console.log('🔄 Starting stage transcription process:', {
    stageId,
    timestamp: new Date().toISOString()
  });

  const stageService = new StageService();
  console.log('🔍 Fetching stage details...');
  // @ts-ignore
  const stage = (await stageService.get(stageId))?.toObject();

  if (!stage?.streamSettings.playbackId) {
    console.error('❌ Invalid stage data:', {
      stageId,
      hasPlaybackId: !!stage?.streamSettings.playbackId,
      timestamp: new Date().toISOString()
    });
    throw new Error('Stage not found or no playbackId');
  }

  if (!stage.streamSettings.isActive) {
    console.error('❌ Stage is not active:', {
      stageId,
      timestamp: new Date().toISOString()
    });
    throw new Error('Stage is not active');
  }

  try {
    console.log('🎬 Starting audio transcription:', {
      stageId,
      playbackId: stage.streamSettings.playbackId,
      timestamp: new Date().toISOString()
    });

    await transcribeAudio(
      buildPlaybackUrl(stage.streamSettings.playbackId),
      stage,
    );
    
    console.log('✅ Updating transcription status to completed:', {
      stageId,
      timestamp: new Date().toISOString()
    });
    await updateTranscriptionStatus(stage, 'completed');
    
    console.log('✅ Stage transcription completed successfully:', {
      stageId,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('❌ Stage transcription failed:', {
      stageId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    await updateTranscriptionStatus(stage, 'failed');
    throw error;
  }
};

const updateTranscriptionStatus = async (
  stage: IStage,
  status: 'completed' | 'failed',
) => {
  console.log(`🔄 Updating transcription status to ${status}:`, {
    stageId: stage._id,
    timestamp: new Date().toISOString()
  });

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

    console.log('📊 Current transcription state:', {
      stageId: stage._id,
      existingChunks: chunks.length,
      lastSegmentTimestamp,
      timestamp: new Date().toISOString()
    });

    const startFFmpeg = (startTime = 0) => {
      console.log('🎥 Starting FFmpeg process:', {
        stageId: stage._id,
        streamUrl,
        startTime,
        timestamp: new Date().toISOString()
      });

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
          ...(startTime > 0 ? ['-ss', startTime.toString()] : []),
        ])
        .audioCodec('pcm_s16le')
        .audioBitrate('32k')
        .audioCodec('libmp3lame')
        .audioFrequency(8000)
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
          console.log('🎬 FFmpeg started:', {
            stageId: stage._id,
            commandLine,
            timestamp: new Date().toISOString()
          });
        })
        .on('stderr', (stderrLine) => {
          if (stderrLine.toLowerCase().includes('error')) {
            console.error('❌ FFmpeg error:', {
              stageId: stage._id,
              error: stderrLine,
              timestamp: new Date().toISOString()
            });
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
          
          console.log('📈 FFmpeg progress:', {
            stageId: stage._id,
            timemark,
            lastSegmentTimestamp,
            timestamp: new Date().toISOString()
          });
        })
        .on('error', (error) => {
          console.error('❌ FFmpeg error, attempting restart:', {
            stageId: stage._id,
            error: error.message,
            timestamp: new Date().toISOString()
          });
          
          if (!stage.streamSettings.isActive) {
            console.log('⏹️ Stage is not active, skipping restart:', {
              stageId: stage._id,
              timestamp: new Date().toISOString()
            });
            return;
          }
          
          setTimeout(() => {
            if (lastSegmentTimestamp > 0) {
              startFFmpeg(lastSegmentTimestamp);
            }
          }, 5000);
        })
        .on('end', () => {
          console.log('✅ FFmpeg processing completed:', {
            stageId: stage._id,
            timestamp: new Date().toISOString()
          });
          resolve();
        });

      return ffmpegProcess;
    };

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
            console.log('🔍 New segment detected:', {
              stageId: stage._id,
              filename,
              timestamp: new Date().toISOString()
            });
            
            await waitForFile(filePath);
            const stats = await fs.stat(filePath);
            console.log('📊 Segment file details:', {
              stageId: stage._id,
              filename,
              size: stats.size,
              timestamp: new Date().toISOString()
            });
            
            await processSegment(filePath);
          } catch (err) {
            console.error('❌ Error processing segment:', {
              stageId: stage._id,
              filename,
              error: err.message,
              stack: err.stack,
              timestamp: new Date().toISOString()
            });
          }
        }
      },
    );

    // Add cleanup for FFmpeg process
    process.on('exit', () => {
      if (ffmpegProcess) {
        console.log('🧹 Cleaning up FFmpeg process:', {
          stageId: stage._id,
          timestamp: new Date().toISOString()
        });
        ffmpegProcess.kill('SIGKILL');
      }
    });
  });
}

const init = async () => {
  try {
    console.log('🚀 Initializing stage transcriptions worker...');
    
    console.log('🔌 Connecting to database...');
    await connect(dbConnection.url);
    console.log('✅ Database connected successfully');

    await consumer();
    console.log('✅ Worker initialization completed');
  } catch (err) {
    console.error('❌ Worker initialization failed:', {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    process.exit(1);
  }
};

// Error handling
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection in stage transcriptions worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception in stage transcriptions worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

init();

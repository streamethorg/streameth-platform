import { stageTranscriptionsQueue } from '@utils/redis';
import ffmpeg, { ffprobe } from 'fluent-ffmpeg';
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
interface StageTranscriptionsJob {
  stageId: string;
}

const consumer = async () => {
  const queue = await stageTranscriptionsQueue();
  queue.process(async (job) => {
    const { stageId } = job.data as StageTranscriptionsJob;
    console.log('Processing job', stageId);
    const stageService = new StageService();
    const stage = (await stageService.get(stageId))?.toObject();
    console.log('Stage', stage);
    if (!stage || !stage.streamSettings.playbackId) {
      throw new Error('Stage not found or no playbackId');
    }
    
    try {
      await transcribeAudio(
        buildPlaybackUrl(stage.streamSettings.playbackId),
        stage,
      );
      await stageService.update(stage._id.toString(), {
        ...stage,
        transcripts: {
          ...stage.transcripts,
          status: 'completed' as const,
        },
      });
      return true;
    } catch (error) {
      await stageService.update(stage._id.toString(), {
        ...stage,
        transcripts: {
          ...stage.transcripts,
          status: 'failed' as const,
        },
      });
      throw error;
    }
  });
};

async function transcribeAudio(
  streamUrl: string,
  stage: IStage,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const tempDir = tmpdir();
    const outputPath = join(tempDir, `${stage._id.toString()}_segment_%d.wav`);
    const stageService = new StageService();
    let chunks = [...(stage.transcripts?.chunks || [])];
    let text = stage.transcripts?.text || '';
    let lastSegmentTimestamp = 0;

    const handleError = (error: Error) => {
      console.error('FFmpeg error:', error);
      reject(error);
    };

    // const processSegment = async (filePath: string) => {
    //   try {
    //     const transcript = await WhisperAPI.transcribe(filePath);
    //     chunks = [...chunks, ...transcript.words];
    //     text = text + transcript.text;
    //     const stageObject = {
    //       ...stage,
    //       transcripts: {
    //         ...stage.transcripts,
    //         status: 'processing' as const,
    //         lastSegmentTimestamp,
    //         chunks,
    //         text,
    //       },
    //     };
    //     console.log('stageObject:', stageObject);
    //     await stageService.update(stage._id.toString(), stageObject);
    //     await fs.unlink(filePath); // Clean up the temporary file

    //   } catch (err) {
    //     console.error('Transcription error:', err);
    //     // Continue processing despite errors
    //   }
    // };

    console.log('Starting FFmpeg process with URL:', streamUrl);
    
    ffmpeg(streamUrl)
      .inputOptions([
        '-re',
        '-protocol_whitelist', 'file,http,https,tcp,tls,crypto',
        '-analyzeduration', '20M',
        '-probesize', '20M',
        '-fflags', '+igndts',
        '-live_start_index', '-1',
        '-loglevel', 'info',
        '-stats'
      ])
      .audioCodec('pcm_s16le')
      .audioFrequency(16000)
      .audioChannels(1)
      .outputOptions([
        '-map', '0:a:0',
        '-f', 'segment',
        '-segment_time', '60',
        '-reset_timestamps', '1',
        '-progress', 'pipe:1'
      ])
      .pipe()
      .on('data', async (chunk) => {
        console.log('FFmpeg data:', chunk);
      })
      .on('start', (commandLine) => {
        console.log('FFmpeg started');
      })
      .on('stderr', (stderrLine) => {
        if (stderrLine.toLowerCase().includes('error')) {
          console.error('FFmpeg error:', stderrLine);
        }
      })
      .on('progress', (progress) => {
        console.log('FFmpeg progress:', progress);
        const timemark = progress.timemark;
        if (typeof timemark === 'string' && timemark.includes(':')) {
          const [hours, minutes, seconds] = timemark.split(':').map(Number);
          lastSegmentTimestamp = hours * 3600 + minutes * 60 + seconds;
        } else {
          lastSegmentTimestamp = parseFloat(progress.timemark);
        }
      })

      .on('error', handleError)
      .on('end', () => {
        console.log('FFmpeg processing completed');
        resolve();
      })
      .on('error', handleError)

  //   const waitForFile = async (filePath: string, retries = 20, delay = 500): Promise<void> => {
  //     let lastSize = 0;
  //     for (let i = 0; i < retries; i++) {
  //       const stats = await fs.stat(filePath);
  //       if (stats.size === lastSize && stats.size > 0) {
  //         return;
  //       }
  //       lastSize = stats.size;
  //       await new Promise(resolve => setTimeout(resolve, delay));
  //     }
  //     throw new Error('File not stable after maximum retries');
  //   };

  //   const watcher = watch(tempDir, async (eventType: 'rename' | 'change', filename: string) => {
  //     if (eventType === 'rename' && filename.startsWith(`${stage._id.toString()}_segment_`)) {
  //       const filePath = join(tempDir, filename);
  //       try {
  //         await waitForFile(filePath);
  //         console.log('New segment file:', filePath);
  //         console.log('File size:', (await fs.stat(filePath)).size);
  //         await processSegment(filePath);
  //       } catch (err) {
  //         console.error('Error processing segment:', err);
  //       }
  //     }
  //   });

  //   // Clean up watcher when done
  //   process.on('exit', () => watcher.close());
  });
}

const init = async () => {
  console.log('Initializing stage transcriptions worker...');
  try {
    await connect(dbConnection.url);
    console.log('Database connected successfully');
    
    await consumer();
    console.log('Consumer started successfully');
  } catch (err) {
    console.error('Worker initialization failed:', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

init().catch((error) => {
  console.error('Failed to initialize worker:', error);
  process.exit(1);
});



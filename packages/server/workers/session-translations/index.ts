import { translationsQueue } from '@utils/redis';
import { dbConnection } from '@databases/index';
import { connect } from 'mongoose';
import { tmpdir } from 'os';
import { join } from 'path';
import StorageService from '@utils/s3';
import { ProcessingStatus } from '@interfaces/session.interface';
import Session from '@models/session.model';
import { createAssetFromUrl } from '@utils/livepeer';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

interface TranslationJob {
  sessionId: string;
  targetLanguage: string;
}

const consumer = async () => {
  console.log('🌐 Starting session translations worker consumer');
  const queue = await translationsQueue();
  queue.process(async (job) => {
    const data = job.data as TranslationJob;
    console.log('📋 Processing translation job:', {
      jobId: job.id,
      sessionId: data.sessionId,
      targetLanguage: data.targetLanguage,
      timestamp: new Date().toISOString()
    });
    
    try {
      return await processTranslation(data);
    } catch (error) {
      console.error('❌ Translation processing failed:', {
        sessionId: data.sessionId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      await Session.findByIdAndUpdate(data.sessionId, {
        $set: {
          [`translations.${data.targetLanguage}.status`]: ProcessingStatus.failed,
        },
      });
      throw error;
    }
  });
};

const processTranslation = async (data: TranslationJob) => {
  console.log('🔄 Starting translation process:', {
    sessionId: data.sessionId,
    targetLanguage: data.targetLanguage,
    timestamp: new Date().toISOString()
  });

  try {
    // 1. Get session and check for transcriptions
    const session = await Session.findById(data.sessionId);
    if (!session?.transcripts?.text) {
      throw new Error('Session has no transcriptions to translate');
    }

    // 2. Update status to translating
    await Session.findByIdAndUpdate(data.sessionId, {
      $set: {
        [`translations.${data.targetLanguage}.status`]: ProcessingStatus.translating,
      },
    });

    // TODO: Implement translation service call here
    // const translatedText = await translateService.translate(session.transcripts.text, data.targetLanguage);

    // 3. Update status to generating audio
    await Session.findByIdAndUpdate(data.sessionId, {
      $set: {
        [`translations.${data.targetLanguage}.status`]: ProcessingStatus.generatingAudio,
      },
    });

    // TODO: Implement text-to-speech service call here
    // const audioFile = await ttsService.generateSpeech(translatedText, data.targetLanguage);

    // 4. Update status to processing video
    await Session.findByIdAndUpdate(data.sessionId, {
      $set: {
        [`translations.${data.targetLanguage}.status`]: ProcessingStatus.processingVideo,
      },
    });

    const tempDir = tmpdir();
    const outputPath = join(tempDir, `${session._id.toString()}_${data.targetLanguage}.mp4`);

    // TODO: Implement ffmpeg processing to merge video with new audio
    // await mergeVideoWithAudio(session.videoUrl, audioFile, outputPath);

    // 5. Upload to Livepeer
    const storageService = new StorageService();
    const fileStream = createReadStream(outputPath);
    console.log('📤 Uploading translated video to S3');
    const url = await storageService.uploadFile(
      `translations/${data.sessionId}/${data.targetLanguage}`,
      fileStream,
      'video/mp4'
    );

    console.log('📤 Creating Livepeer asset for translation');
    const assetId = await createAssetFromUrl(`${data.sessionId}_${data.targetLanguage}`, url);

    // 6. Update session with translation data
    await Session.findByIdAndUpdate(data.sessionId, {
      $set: {
        [`translations.${data.targetLanguage}`]: {
          status: ProcessingStatus.completed,
          assetId,
          text: 'translatedText', // TODO: Replace with actual translated text
        },
      },
    });

    // Cleanup
    fs.unlinkSync(outputPath);
    console.log('✅ Translation completed successfully');
    return true;

  } catch (error) {
    console.error('❌ Error in translation process:', {
      sessionId: data.sessionId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
};

const init = async () => {
  try {
    console.log('🚀 Initializing session translations worker');
    
    console.log('🔌 Connecting to database...');
    await connect(dbConnection.url, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Database connected successfully');

    await consumer();
    console.log('✅ Session translations worker initialized successfully');
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

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection in session translations worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception in session translations worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

init().catch((error) => {
  console.error('❌ Fatal error during session translations worker initialization:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
}); 
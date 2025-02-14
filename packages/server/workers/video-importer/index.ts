import { videoImporterQueue } from '@utils/redis';
import { ISession, ProcessingStatus } from '@interfaces/session.interface';
import Session from '@models/session.model';
import * as fs from 'fs';
import fetch from 'node-fetch';
import youtubedl from 'youtube-dl-exec';
import { getSourceType } from '@utils/util';
import { dbConnection } from '@databases/index';
import { connect } from 'mongoose';

interface VideoImporterData {
  session: ISession;
  videoUrl: string;
  uploadUrl: string;
}

const consumer = async () => {
  console.log('🎬 Starting video importer worker consumer');
  const queue = await videoImporterQueue();
  queue.process(async (job) => {
    const data = job.data as VideoImporterData;
    console.log('📋 Processing video job:', {
      jobId: job.id,
      session: data.session,
      videoUrl: data.videoUrl,
      uploadUrl: data.uploadUrl,
      timestamp: new Date().toISOString(),
    });

    try {
      return await processVideoImport(data);
    } catch (error) {
      console.error('❌ Clip processing failed:', {
        sessionId: data.session._id,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      await Session.findByIdAndUpdate(data.session._id, {
        $set: {
          processingStatus: ProcessingStatus.failed,
        },
      });
      throw error;
    }
  });
};

const processVideoImport = async (data: VideoImporterData) => {
  const { session, videoUrl, uploadUrl } = data;

  const source = getSourceType(videoUrl);
  if (source.type !== 'youtube' && source.type !== 'twitter') {
    throw new Error('Unsupported video source');
  }

  // First get video info
  let output = (await youtubedl(videoUrl, {
    dumpSingleJson: true,
    noWarnings: true,
    preferFreeFormats: true,
    ffmpegLocation: '/usr/bin/ffmpeg',
    addHeader: source.header,
  })) as unknown as {
    title: string;
    description: string;
    thumbnail: string;
    url: string;
  };

  // Download the video with progress logging
  console.log('🚀 Starting video download...');
  const downloadedVideo = await youtubedl.exec(
    videoUrl,
    {
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4',
      output: `/tmp/${output.title}.mp4`,
      ffmpegLocation: '/usr/bin/ffmpeg',
      addHeader: source.header,
    },
    {
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  if (downloadedVideo.stderr) {
    const progressLines = downloadedVideo.stderr.split('\n');
    for (const line of progressLines) {
      if (line.includes('[download]')) {
        console.log('🔄 Download progress:', line.trim());
      }
    }
  }
  console.log('🎉 Download completed');

  // Read the file into a Buffer
  const videoBuffer = fs.readFileSync(`/tmp/${output.title}.mp4`);

  // Clean up the temporary file
  fs.unlink(`/tmp/${output.title}.mp4`, (err) => {
    if (err) console.error('🚫 Error cleaning up temp file:', err);
    else console.log('🚮 Temporary file cleaned up successfully');
  });



  // Upload the video buffer to Livepeer
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    body: videoBuffer,
    headers: {
      'Content-Type': 'video/mp4',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload video: ${response.statusText}`);
  }

  return session;
};


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
    const queue = await videoImporterQueue();
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
  console.error('❌ Unhandled rejection in video importer worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception in video importer worker:', {
    error,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

init().catch((error) => {
  console.error('❌ Fatal error during video importer worker initialization:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  });
  process.exit(1);
});

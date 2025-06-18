import { clipsQueue } from '@utils/redis';
import { IClip } from '@interfaces/clip.interface';
import ffmpeg from 'fluent-ffmpeg';
import { dbConnection } from '@databases/index';
import { connect } from 'mongoose';
import { tmpdir } from 'os';
import { join } from 'path';
import StorageService from '@utils/s3';
import { ProcessingStatus } from '@interfaces/session.interface';
import Session from '@models/session.model';
import { createAssetFromUrl } from '@utils/livepeer';
import { transcribeAudio as transcribeAudioSession } from '@workers/session-transcriptions';
import * as fs from 'fs';
import clipEditorService from '@services/clipEditor.service';
import fetch from 'node-fetch';
import ClipEditor from '@models/clip.editor.model';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';

interface Segment {
  duration: number;
  url: string;
  startTime: number;
}

const consumer = async () => {
  console.log('🎬 Starting clips worker consumer');
  const queue = await clipsQueue();
  queue.process(async (job) => {
    const data = job.data as IClip;
    console.log('📋 Processing clip job:', {
      jobId: job.id,
      sessionId: data.sessionId,
      start: data.start,
      end: data.end,
      hasEditorOptions: !!data.editorOptions,
      timestamp: new Date().toISOString(),
    });

    try {
      return await processClip(data);
    } catch (error) {
      console.error('❌ Clip processing failed:', {
        sessionId: data.sessionId,
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      await Session.findByIdAndUpdate(data.sessionId, {
        $set: {
          processingStatus: ProcessingStatus.failed,
        },
      });
      throw error;
    }
  });
};

const processClip = async (data: IClip) => {
  console.log('🎥 Starting clip processing:', {
    sessionId: data.sessionId,
    start: data.start,
    end: data.end,
    hasEditorOptions: !!data.editorOptions,
    timestamp: new Date().toISOString(),
  });

  try {
    console.log('📥 Fetching master playlist:', {
      url: data.clipUrl,
      timestamp: new Date().toISOString(),
    });

    const masterResponse = await fetch(data.clipUrl);
    if (!masterResponse.ok) {
      console.error('❌ Failed to fetch master playlist:', {
        status: masterResponse.status,
        statusText: masterResponse.statusText,
        timestamp: new Date().toISOString(),
      });
      throw new Error(
        `Failed to fetch master playlist: ${masterResponse.statusText}`,
      );
    }

    const masterContent = await masterResponse.text();
    console.log('✅ Successfully fetched master playlist');

    // Find the highest quality variant
    console.log('🔍 Searching for highest quality variant');
    const linesMaster = masterContent.split('\n');
    let variantUrl = '';
    let maxBandwidth = -1;

    for (let i = 0; i < linesMaster.length; i++) {
      if (linesMaster[i].startsWith('#EXT-X-STREAM-INF')) {
        const bandwidthMatch = linesMaster[i].match(/BANDWIDTH=(\d+)/);
        if (bandwidthMatch) {
          const bandwidth = parseInt(bandwidthMatch[1]);
          if (bandwidth > maxBandwidth) {
            maxBandwidth = bandwidth;
            variantUrl = linesMaster[i + 1].trim();
          }
        }
      }
    }

    console.log('🎯 Selected variant details:', {
      bandwidth: maxBandwidth,
      url: variantUrl,
      timestamp: new Date().toISOString(),
    });

    variantUrl = data.clipUrl.replace('index.m3u8', variantUrl);
    console.log('🔗 Full variant URL:', variantUrl);

    if (!variantUrl) {
      console.error('❌ Highest quality variant not found');
      throw new Error('Highest quality variant not found in master playlist');
    }

    const duration = data.end - data.start;
    console.log('⏱️ Clip duration details:', {
      start: data.start,
      end: data.end,
      duration,
      timestamp: new Date().toISOString(),
    });

    const tempDir = tmpdir();
    const concatPath = join(tempDir, `${data.sessionId}-concat.mp4`);
    const outputPath = join(tempDir, `${data.sessionId}.mp4`);
    console.log('📁 Temporary file paths:', {
      concatPath,
      outputPath,
      timestamp: new Date().toISOString(),
    });

    // 1. Fetch and parse manifest
    console.log('📥 Fetching variant manifest');
    const manifestResponse = await fetch(variantUrl);
    if (!manifestResponse.ok) {
      console.error('❌ Failed to fetch variant manifest:', {
        status: manifestResponse.status,
        statusText: manifestResponse.statusText,
      });
      throw new Error(
        `Failed to fetch manifest ${variantUrl}: ${manifestResponse.statusText}`,
      );
    }
    const manifestContent = await manifestResponse.text();
    console.log('✅ Successfully fetched variant manifest');

    // 2. Parse segments and their durations
    console.log('🔍 Parsing segments from manifest');
    const segments: Segment[] = [];
    let cumulativeTime = 0;
    const lines = manifestContent.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        const duration = parseFloat(line.split(':')[1].split(',')[0]);
        const url = lines[i + 1].trim();

        // Only process segments that could be part of our clip
        if (
          !url.startsWith('#') &&
          cumulativeTime <= data.end + duration &&
          cumulativeTime + duration >= data.start
        ) {
          segments.push({
            duration,
            url: url.startsWith('http')
              ? url
              : new URL(url, variantUrl).toString(),
            startTime: cumulativeTime,
          });
        }
        cumulativeTime += duration;
      }
    }

    if (segments.length === 0) {
      console.error('❌ No segments found for specified time range:', {
        start: data.start,
        end: data.end,
      });
      throw new Error(
        `No segments found for time range ${data.start}-${data.end}`,
      );
    }

    console.log('📊 Segment analysis:', {
      totalSegments: segments.length,
      clipDuration: duration,
      firstSegmentStart: segments[0].startTime,
      lastSegmentStart: segments[segments.length - 1].startTime,
    });

    // 3. Download segments in parallel with progress tracking
    const CONCURRENT_DOWNLOADS = 3;
    const segmentPaths: string[] = new Array(segments.length);

    // Progress tracking
    let completedDownloads = 0;
    let totalBytes = 0;
    let downloadedBytes = 0;

    const updateProgress = () => {
      completedDownloads++;
      const percentComplete = (completedDownloads / segments.length) * 100;
      const downloadedMB = downloadedBytes / (1024 * 1024);
      const totalMB = totalBytes / (1024 * 1024);

      // console.log('📥 Download progress:', {
      //   completedSegments: completedDownloads,
      //   totalSegments: segments.length,
      //   percentComplete: `${percentComplete.toFixed(1)}%`,
      //   downloadedSize: `${downloadedMB.toFixed(1)}MB`,
      //   totalSize: `${totalMB.toFixed(1)}MB`,
      // });
    };

    const downloadSegment = async (segment: Segment, index: number) => {
      const segmentPath = join(tempDir, `segment_${index}.ts`);
      console.log(`📥 Downloading segment ${index}:`, {
        startTime: segment.startTime,
        duration: segment.duration,
      });

      const response = await fetch(segment.url);
      if (!response.ok) {
        console.error(`❌ Failed to download segment ${index}:`, {
          startTime: segment.startTime,
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(
          `Failed to download segment at ${segment.startTime}s: ${response.statusText}`,
        );
      }

      // Get content length if available
      const contentLength = parseInt(
        response.headers.get('content-length') || '0',
      );
      if (contentLength) {
        totalBytes += contentLength;
      }

      // Stream the response directly to file instead of buffering
      const fileStream = fs.createWriteStream(segmentPath);
      await new Promise((resolve, reject) => {
        response.body.pipe(fileStream);
        response.body.on('error', reject);
        fileStream.on('finish', () => {
          downloadedBytes += contentLength || 0;
          updateProgress();
          resolve(true);
        });
        fileStream.on('error', reject);
      });

      return segmentPath;
    };

    // Use a pool of promises to control concurrency
    const downloadPool = async <T>(
      items: T[],
      handler: (item: T, index: number) => Promise<string>,
      concurrency: number,
    ): Promise<string[]> => {
      const results: string[] = new Array(items.length);
      let currentIndex = 0;

      const workers = new Array(concurrency).fill(null).map(async () => {
        while (currentIndex < items.length) {
          const index = currentIndex++;
          results[index] = await handler(items[index], index);
        }
      });

      await Promise.all(workers);
      return results;
    };

    try {
      console.log('🚀 Starting parallel segment downloads:', {
        totalSegments: segments.length,
        concurrentDownloads: CONCURRENT_DOWNLOADS,
      });
      const startTime = Date.now();

      segmentPaths.splice(
        0,
        segments.length,
        ...(await downloadPool(
          segments,
          downloadSegment,
          CONCURRENT_DOWNLOADS,
        )),
      );

      const duration = (Date.now() - startTime) / 1000;
      const speed = downloadedBytes / (1024 * 1024) / duration; // MB/s
      console.log('✅ Segment downloads completed:', {
        duration: `${duration.toFixed(1)}s`,
        averageSpeed: `${speed.toFixed(1)} MB/s`,
        totalSize: `${(downloadedBytes / (1024 * 1024)).toFixed(1)}MB`,
      });
    } catch (error) {
      console.error('❌ Error during segment downloads:', error);
      // Clean up any partially downloaded segments
      await Promise.all(
        segmentPaths
          .filter(Boolean)
          .map((path) => fs.promises.unlink(path).catch(() => {})),
      );
      throw error;
    }

    // 4. Create concat file
    console.log('📝 Creating concat file');
    const concatFilePath = join(tempDir, `${data.sessionId}-concat.txt`);
    const concatContent = segmentPaths
      .map((path) => `file '${path}'`)
      .join('\n');

    await fs.promises.writeFile(concatFilePath, concatContent);
    console.log('✅ Concat file created:', concatFilePath);

    // 5. Calculate precise offset from first segment
    const offsetInFirstSegment = data.start - segments[0].startTime;
    console.log('⚡ Calculated clip parameters:', {
      offsetInFirstSegment,
      totalDuration: duration,
    });

    const logMemoryUsage = () => {
      const used = process.memoryUsage();
      console.log('Memory usage:', {
        rss: `${Math.round(used.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(used.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(used.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(used.external / 1024 / 1024)}MB`,
      });
    };

    // Log every 5 seconds
    const memoryInterval = setInterval(logMemoryUsage, 5000);

    return new Promise((resolve, reject) => {
      console.log('🎬 Starting FFmpeg concatenation');
      ffmpeg()
        .input(concatFilePath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions([
          '-c',
          'copy',
          '-loglevel error',
          '-threads 2', // Limit FFmpeg threads
          '-max_muxing_queue_size 1024', // Limit muxing queue
        ])
        .output(concatPath)
        .on('start', (command) => {
          console.log('🎥 FFmpeg concat command:', {
            command,
            timestamp: new Date().toISOString(),
          });
        })
        .on('end', () => {
          console.log('✅ FFmpeg concatenation completed');
          fs.unlinkSync(concatFilePath);
          segmentPaths.forEach((path) => fs.unlinkSync(path));
          console.log('🧹 Cleaned up temporary segment files');

          console.log('🎬 Starting FFmpeg trim operation');
          ffmpeg()
            .input(concatPath)
            .inputOptions([`-ss ${offsetInFirstSegment}`, '-loglevel error'])
            .outputOptions(['-c copy', '-f mp4', '-movflags +faststart'])
            .duration(duration)
            .output(outputPath)
            .on('start', (command) => {
              console.log('🎥 FFmpeg trim command:', {
                command,
                timestamp: new Date().toISOString(),
              });
            })
            .on('end', async () => {
              try {
                fs.unlinkSync(concatPath);
                console.log('🧹 Cleaned up concatenated file');

                console.log('✅ Clip creation finished');
                const storageService = new StorageService();

                const stats = await stat(outputPath);
                console.log('📊 Output file size:', {
                  bytes: stats.size,
                  megabytes: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
                  gigabytes:
                    (stats.size / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
                  timestamp: new Date().toISOString(),
                });

                const fileStream = createReadStream(outputPath);
                console.log('📤 Uploading clip to S3');
                const url = await storageService.uploadFile(
                  'clips/' + data.sessionId,
                  fileStream,
                  'video/mp4',
                );
                console.log('✅ Clip uploaded to S3:', url);

                if (data.editorOptions) {
                  console.log(
                    '🎨 Processing editor options:',
                    data.editorOptions,
                  );
                  const updateData = {
                    source: {
                      streamUrl: url,
                      start: data.start,
                      end: data.end,
                    },
                    processingStatus: ProcessingStatus.clipCreated,
                  };

                  console.log('💾 Updating session with clip data');
                  const session = await Session.findByIdAndUpdate(
                    data.sessionId,
                    { $set: updateData },
                    { new: true },
                  );

                  if (!session) {
                    console.error('❌ Session not found:', data.sessionId);
                    throw new Error(`Session not found: ${data.sessionId}`);
                  }

                  if (data.editorOptions.captionEnabled) {
                    console.log('🎯 Starting audio transcription');
                    await transcribeAudioSession(url, session);
                    console.log('✅ Audio transcription completed');
                  }

                  console.log('🎨 Finding clip editor configuration');
                  const clipEditor = await ClipEditor.findOne({
                    clipSessionId: data.sessionId,
                  });
                  console.log('🎬 Launching Remotion render');
                  await clipEditorService.launchRemotionRender(clipEditor);
                  console.log('✅ Remotion render launched');

                  await Session.findByIdAndUpdate(
                    data.sessionId,
                    { $set: { processingStatus: ProcessingStatus.rendering } },
                    { new: true },
                  );
                  console.log('💾 Updated session status to rendering');
                } else {
                  console.log('📤 Creating Livepeer asset');
                  const assetId = await createAssetFromUrl(data.sessionId, url);
                  console.log('✅ Livepeer asset created:', assetId);

                  console.log('💾 Updating session with asset ID');
                  await Session.findByIdAndUpdate(data.sessionId, {
                    $set: {
                      assetId,
                      processingStatus: ProcessingStatus.pending,
                    },
                  });
                }

                fs.unlinkSync(outputPath);
                console.log('🧹 Cleaned up output file');
                console.log('✅ Clip processing completed successfully');
                resolve(true);
              } catch (error) {
                console.error('❌ Error in final processing steps:', {
                  error: error.message,
                  stack: error.stack,
                  timestamp: new Date().toISOString(),
                });
                reject(error);
              } finally {
                clearInterval(memoryInterval);
              }
            })
            .on('progress', (progress) => {
              console.log('📈 FFmpeg trim progress:', {
                ...progress,
                timestamp: new Date().toISOString(),
              });
            })
            .on('error', async (err) => {
              console.error('❌ Error during FFmpeg trim:', {
                error: err.message,
                stack: err.stack,
                timestamp: new Date().toISOString(),
              });
              fs.unlinkSync(concatPath);
              await Session.findByIdAndUpdate(data.sessionId, {
                $set: {
                  processingStatus: ProcessingStatus.failed,
                },
              });
              reject(err);
            })
            .run();
        })
        .on('progress', (progress) => {
          console.log('📈 FFmpeg concat progress:', {
            ...progress,
            timestamp: new Date().toISOString(),
          });
        })
        .on('error', async (err) => {
          console.error('❌ Error during FFmpeg concat:', {
            error: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
          });
          await Session.findByIdAndUpdate(data.sessionId, {
            $set: {
              processingStatus: ProcessingStatus.failed,
            },
          });
          reject(err);
        })
        .run();
    });
  } catch (error) {
    console.error('❌ Fatal error in clip processing:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });
    await Session.findByIdAndUpdate(data.sessionId, {
      $set: {
        processingStatus: ProcessingStatus.failed,
      },
    });
    throw error;
  }
};

const init = async () => {
  try {
    console.log('🚀 Initializing clips worker');

    console.log('🔌 Connecting to database...');
    await connect(dbConnection.url, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Database connected successfully');

    await consumer();
    console.log('✅ Clips worker initialized successfully');
  } catch (err) {
    console.error('❌ Worker initialization failed:', {
      name: err.name,
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    });
    process.exit(1);
  }
};

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection in clips worker:', {
    error,
    timestamp: new Date().toISOString(),
  });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception in clips worker:', {
    error,
    timestamp: new Date().toISOString(),
  });
  process.exit(1);
});

init().catch((error) => {
  console.error('❌ Fatal error during clips worker initialization:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });
  process.exit(1);
});

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

interface Segment {
  duration: number;
  url: string;
  startTime: number;
}

const consumer = async () => {
  const queue = await clipsQueue();
  queue.process(async (job) => {
    const data = job.data as IClip;
    try {
      return await processClip(data);
    } catch (error) {
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
  console.log('Starting processClip with data:', data);
  const { sessionId, clipUrl, start, end } = data;

  try {
    const masterResponse = await fetch(clipUrl);
    if (!masterResponse.ok) {
      throw new Error(
        `Failed to fetch master playlist: ${masterResponse.statusText}`,
      );
    }
    const masterContent = await masterResponse.text();

    // 2. Find the 1080p variant
    const linesMaster = masterContent.split('\n');
    let variantUrl = '';

    for (let i = 0; i < linesMaster.length; i++) {
      if (linesMaster[i].includes('1080p0')) {
        variantUrl = linesMaster[i + 1].trim();
        break;
      }
    }
    variantUrl = clipUrl.replace('index.m3u8', variantUrl);

    if (!variantUrl) {
      throw new Error('1080p variant not found in master playlist');
    }

    const duration = end - start;
    console.log('relativeStartSeconds', start, end, duration);
    const tempDir = tmpdir();
    const concatPath = join(tempDir, `${sessionId}-concat.mp4`);
    const outputPath = join(tempDir, `${sessionId}.mp4`);

    // 1. Fetch and parse manifest
    const manifestResponse = await fetch(variantUrl);
    if (!manifestResponse.ok) {
      throw new Error(
        `Failed to fetch manifest: ${manifestResponse.statusText}`,
      );
    }
    const manifestContent = await manifestResponse.text();

    // 2. Parse segments and their durations
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
          cumulativeTime <= end + duration &&
          cumulativeTime + duration >= start
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
      throw new Error(`No segments found for time range ${start}-${end}`);
    }

    console.log(
      `Found ${segments.length} segments for clip from ${start}s to ${end}s`,
    );
    console.log('First segment starts at:', segments[0].startTime);
    console.log(
      'Last segment starts at:',
      segments[segments.length - 1].startTime,
    );

    // 3. Download segments in parallel with progress tracking
    const CONCURRENT_DOWNLOADS = 5;
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

      console.log(
        `Download Progress: ${completedDownloads}/${segments.length} segments ` +
          `(${percentComplete.toFixed(1)}%) - ${downloadedMB.toFixed(1)}MB/${totalMB.toFixed(1)}MB`,
      );
    };

    const downloadSegment = async (segment: Segment, index: number) => {
      const segmentPath = join(tempDir, `segment_${index}.ts`);
      const response = await fetch(segment.url);
      if (!response.ok) {
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

      const buffer = await response.buffer();
      await fs.promises.writeFile(segmentPath, buffer);

      // Update progress
      downloadedBytes += buffer.length;
      updateProgress();

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
      console.log(
        `Starting download of ${segments.length} segments with ${CONCURRENT_DOWNLOADS} concurrent downloads`,
      );
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
      console.log(
        `Downloads completed in ${duration.toFixed(1)}s ` +
          `(${speed.toFixed(1)} MB/s average)`,
      );
    } catch (error) {
      // Clean up any partially downloaded segments
      await Promise.all(
        segmentPaths
          .filter(Boolean)
          .map((path) => fs.promises.unlink(path).catch(() => {})),
      );
      throw error;
    }

    // 4. Create concat file
    const concatFilePath = join(tempDir, `${sessionId}-concat.txt`);
    const concatContent = segmentPaths
      .map((path) => `file '${path}'`)
      .join('\n');

    await fs.promises.writeFile(concatFilePath, concatContent);

    // 5. Calculate precise offset from first segment
    const offsetInFirstSegment = start - segments[0].startTime;

    return new Promise((resolve, reject) => {
      // First concatenate required segments
      ffmpeg()
        .input(concatFilePath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions(['-c', 'copy'])
        .output(concatPath)
        .on('end', () => {
          // Clean up concat file and segment files
          fs.unlinkSync(concatFilePath);
          segmentPaths.forEach((path) => fs.unlinkSync(path));

          // Then trim the exact portion we need
          ffmpeg()
            .input(concatPath)
            .inputOptions([`-ss ${offsetInFirstSegment}`])
            .outputOptions(['-c copy', '-f mp4', '-movflags +faststart'])
            .duration(duration)
            .output(outputPath)
            .on('end', async () => {
              try {
                fs.unlinkSync(concatPath);

                console.log('Clip creation finished');
                const storageService = new StorageService();
                const fileBuffer = await fs.promises.readFile(outputPath);
                console.log('uploading file to s3');
                const url = await storageService.uploadFile(
                  'clips/' + sessionId,
                  fileBuffer,
                  'video/mp4',
                );
                console.log('Clip uploaded to:', url);

                if (data.editorOptions) {
                  console.log('editorOptions', data.editorOptions);
                  // Make sure we're passing a plain object for the update
                  const updateData = {
                    source: {
                      streamUrl: url,
                      start,
                      end,
                    },
                    processingStatus: ProcessingStatus.clipCreated,
                  };

                  const session = await Session.findByIdAndUpdate(
                    sessionId,
                    { $set: updateData },
                    { new: true },
                  );

                  if (!session) {
                    throw new Error(`Session not found: ${sessionId}`);
                  }
                  if (data.editorOptions.captionEnabled) {
                    await transcribeAudioSession(url, session);
                  }

                  const clipEditor = await ClipEditor.findOne({
                    clipSessionId: sessionId,
                  });
                  console.log('clipEditor', clipEditor);
                  await clipEditorService.launchRemotionRender(clipEditor);
                  fs.unlinkSync(outputPath);
                  resolve(true);
                } else {
                  console.log('creating asset from url');
                  const assetId = await createAssetFromUrl(sessionId, url);
                  console.log('assetId', assetId);

                  // Make sure we're passing a plain object for the update
                  await Session.findByIdAndUpdate(sessionId, {
                    $set: {
                      assetId,
                    },
                  });
                  fs.unlinkSync(outputPath);
                  resolve(true);
                }
              } catch (error) {
                console.error('Error creating clip:', error);
                reject(error);
              }
            })
            .on('progress', (progress) => {
              console.log('trimming progress', progress);
            })
            .on('error', async (err) => {
              console.error('Error trimming clip:', err);
              fs.unlinkSync(concatPath);
              await Session.findByIdAndUpdate(sessionId, {
                $set: {
                  processingStatus: ProcessingStatus.failed,
                },
              });
              reject(err);
            })
            .run();
        })
        .on('progress', (progress) => {
          console.log('download progress', progress);
        })
        .on('error', async (err) => {
          console.error('Error downloading segments:', err);
          await Session.findByIdAndUpdate(sessionId, {
            $set: {
              processingStatus: ProcessingStatus.failed,
            },
          });
          reject(err);
        })
        .run();
    });
  } catch (error) {
    console.error('Error processing clip:', error);
    await Session.findByIdAndUpdate(sessionId, {
      $set: {
        processingStatus: ProcessingStatus.failed,
      },
    });
    throw error;
  }
};

const init = async () => {
  try {
    await connect(dbConnection.url, {
      serverSelectionTimeoutMS: 5000,
    });

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

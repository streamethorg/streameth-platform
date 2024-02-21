import { youtube_v3 } from 'googleapis';
import { ISession } from '@interfaces/session.interface';
import { createReadStream, createWriteStream } from 'fs';
import https from 'https';
import StateService from '@services/state.service';

// Utility function to introduce a delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Checks the processing status of a YouTube video
async function checkVideoProcessingStatus(
  videoId: string,
  youtube: youtube_v3.Youtube,
): Promise<string> {
  const response = await youtube.videos.list({
    id: [videoId],
    part: ['processingDetails'],
  });

  return response.data.items[0].processingDetails.processingStatus;
}

// Downloads an image from a URL and saves it to a file
async function downloadImage(
  url: string,
  filePath: string,
): Promise<{ success: boolean; message?: string }> {
  return new Promise((resolve) => {
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = createWriteStream(filePath);
          response.pipe(fileStream);

          fileStream.on('finish', () => {
            fileStream.close();
            console.log('Image download completed:', filePath);
            resolve({ success: true });
          });
        } else {
          console.error('Image download failed:', response.statusCode);
          resolve({
            success: false,
            message: `Failed with status code: ${response.statusCode}`,
          });
        }
      })
      .on('error', (error) => {
        console.error('Error downloading image:', error.message);
        resolve({ success: false, message: error.message });
      });
  });
}

// Sets the thumbnail for a YouTube video
async function setThumbnail(
  youtube: youtube_v3.Youtube,
  videoId: string,
  filePath: string,
  stateService: StateService,
  stateId: string,
): Promise<void> {
  try {
    const response = await youtube.thumbnails.set({
      videoId: videoId,
      media: {
        body: createReadStream(filePath),
      },
    });

    console.log('Thumbnail set successfully:', response.data);
    await stateService.update(stateId, { status: 'completed' } as any);
  } catch (error) {
    console.error('Error setting thumbnail:', error);
    await stateService.update(stateId, { status: 'canceled' } as any);
  }
}

// Uploads a video to YouTube and handles thumbnail setting
export async function uploadToYouTube(
  session: ISession,
  youtube: youtube_v3.Youtube,
  videoFilePath: string,
): Promise<void> {
  const stateService = new StateService();

  try {
    const insertResponse = await youtube.videos.insert({
      part: ['status', 'snippet'],
      requestBody: {
        snippet: {
          title: session.name,
          description: session.description,
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'private', // Change as needed
        },
      },
      media: {
        body: createReadStream(videoFilePath),
      },
    });

    console.log('YouTube video upload initiated:', insertResponse.data);

    const state = await stateService.create({
      type: 'video',
      sessionId: session._id,
      sessionSlug: session.slug,
    } as any);

    let processingStatus = 'processing';
    while (processingStatus === 'processing') {
      processingStatus = await checkVideoProcessingStatus(
        insertResponse.data.id,
        youtube,
      );
      if (processingStatus === 'processing') {
        await delay(180000); // Delay for 3 minutes
      } else if (processingStatus === 'error') {
        await stateService.update(state._id.toString(), {
          status: 'canceled',
        } as any);
        return;
      }
    }

    if (!session.coverImage) return;

    const filePath = `./tmp/${session.slug}.jpg`;
    const imageResponse = await downloadImage(session.coverImage, filePath);
    if (imageResponse.success) {
      await setThumbnail(
        youtube,
        insertResponse.data.id,
        filePath,
        stateService,
        state._id.toString(),
      );
    } else {
      await stateService.update(state._id.toString(), {
        status: 'canceled',
      } as any);
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return;
  }
}

import { type youtube_v3 } from 'googleapis';
import { ISession } from '@interfaces/session.interface';
import { createReadStream, createWriteStream } from 'fs';
import https from 'http';
import StateService from '@services/state.service';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkVideoProcessingStatus(
  videoId: string,
  youtube: youtube_v3.Youtube,
) {
  const response = await youtube.videos.list({
    id: [videoId],
    part: ['processingDetails'],
  });

  return response.data.items[0].processingDetails.processingStatus;
}

export async function uploadToYouTube(
  session: ISession,
  youtube: youtube_v3.Youtube,
  videoFilePath: string,
): Promise<void> {
  const stateService = new StateService();

  youtube.videos.insert(
    {
      part: ['status', 'snippet'],
      requestBody: {
        snippet: {
          title: session.name,
          description: session.description,
          defaultLanguage: 'en',
          defaultAudioLanguage: 'en',
        },
        status: {
          privacyStatus: 'private', //TODO: Change this once done
        },
      },
      media: {
        body: createReadStream(videoFilePath),
      },
    },
    async function(err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      console.log('A YouTube video is being uploaded', response.data);

      let processingData = 'processing';

      const state = await stateService.create({
        type: 'video',
        sessionId: session._id,
        sessionSlug: session.slug,
      } as any);
      while (processingData !== 'succeeded') {
        processingData = await checkVideoProcessingStatus(
          response.data.id,
          youtube,
        );

        if (processingData === 'processing') {
          await delay(180000); // 3 minutes}
        }
        if (processingData === 'error') {
          stateService.update(state._id.toString(), {
            status: 'caneled',
          } as any);
          return;
        }
      }

      if (!session.coverImage) {
        return;
      }

      const filePath = `./tmp/${session.slug}.jpg`;
      https
        .get(session.coverImage, (response) => {
          if (response.statusCode === 200) {
            const fileStream = createWriteStream(filePath);
            response.pipe(fileStream);

            fileStream.on('finish', () => {
              fileStream.close();
              console.log('Download completed and file saved to', filePath);
            });
          } else {
            console.log(
              'Request failed with status code:',
              response.statusCode,
            );
          }
        })
        .on('error', (error) => {
          console.error('Error downloading the file:', error.message);
          stateService.update(state._id.toString(), {
            status: 'caneled',
          } as any);
          return;
        });

      console.log('Video uploaded. Uploading the thumbnail now.');
      youtube.thumbnails.set(
        {
          videoId: response.data.id,
          media: {
            body: createReadStream(filePath),
          },
        },
        function(err, response) {
          if (err) {
            console.log('The API returned an error: ' + err);
            stateService.update(state._id.toString(), {
              status: 'caneled',
            } as any);
            return;
          }
          console.log(response.data);
          stateService.update(state._id.toString(), {
            status: 'completed',
          } as any);
        },
      );
    },
  );
}

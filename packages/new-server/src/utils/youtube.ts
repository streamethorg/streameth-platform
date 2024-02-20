import { type youtube_v3 } from 'googleapis';

export async function checkVideoProcessingStatus(
  videoId: string,
  youtube: youtube_v3.Youtube,
) {
  try {
    const response = await youtube.videos.list({
      id: [videoId],
      part: ['processingDetails'],
    });
    const processingDetails = response.data.items[0].processingDetails;
    console.log('Processing Data:', response.data);
    if (processingDetails.processingStatus === 'processing') {
      console.log('Video is still processing...');
      setTimeout(() => checkVideoProcessingStatus(videoId, youtube), 30000);
    } else if (processingDetails.processingStatus === 'succeeded') {
      console.log('Video processing completed successfully.');
    } else {
      console.log('Video processing failed or was rejected.');
    }
  } catch (error) {
    console.error('Error checking video processing status:', error.message);
  }
}

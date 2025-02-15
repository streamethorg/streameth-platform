import { type MutableRefObject } from 'react';
import { Upload } from 'tus-js-client';

const uploadVideo = (
  video: File,
  url: string,
  abortControllerRef: AbortController,
  onProgress: (percentage: number) => void,
  onSuccess: () => void
) => {
  const upload = new Upload(video, {
    endpoint: url,
    uploadSize: video.size,
    metadata: {
      filename: video.name,
      filetype: video.type,
    },
    onError: (error) => {
      console.log('An error occurred:', error);
    },
    onProgress: (bytesUploaded, bytesTotal) => {
      const percentage = Math.round((bytesUploaded / bytesTotal) * 100);
      onProgress(percentage);
    },
    onSuccess: () => {
      console.log('Upload successful!');
      onSuccess();
    },
  });

  //abortControllerRef.current = new AbortController();
  abortControllerRef.signal.addEventListener('abort', () => {
    console.log('Aborting upload');
    upload.abort();
  });

  upload.start();
};

export default uploadVideo;

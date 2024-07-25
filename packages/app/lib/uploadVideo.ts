import { type MutableRefObject } from 'react';
import { Upload } from 'tus-js-client';

const uploadVideo = (
  video: File,
  url: string,
  abortControllerRef: MutableRefObject<AbortController>,
  onProgress: (percentage: number) => void,
  onSuccess: () => void
) => {
  const upload = new Upload(video, {
    endpoint: url,
    uploadSize: video.size,
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LIVEPEER_API_KEY}`,
    },
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

  abortControllerRef.current = new AbortController();
  abortControllerRef.current.signal.addEventListener('abort', () => {
    console.log('Aborting upload');
    upload.abort();
  });

  upload.start();
};

export default uploadVideo;

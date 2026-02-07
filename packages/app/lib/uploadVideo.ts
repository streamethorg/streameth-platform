import { Upload } from 'tus-js-client';

const uploadVideo = (
  video: File,
  url: string,
  abortControllerRef: AbortController,
  onProgress: (percentage: number) => void,
  onSuccess: () => void,
  onError?: (error: Error) => void
) => {
  const upload = new Upload(video, {
    endpoint: url,
    uploadSize: video.size,
    chunkSize: 50 * 1024 * 1024, // 50MB chunks for resumable uploads
    retryDelays: [0, 1000, 3000, 5000, 10000], // Retry with backoff on failure
    metadata: {
      filename: video.name,
      filetype: video.type,
    },
    onError: (error) => {
      console.error('Upload error:', error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
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

  abortControllerRef.signal.addEventListener('abort', () => {
    console.log('Aborting upload');
    upload.abort();
  });

  upload.start();
};

export default uploadVideo;

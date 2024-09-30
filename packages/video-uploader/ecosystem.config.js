module.exports = {
  apps: [
    {
      name: 'audio',
      script: './dist/audio-queue.js',
    },
    {
      name: 'video',
      script: './dist/video-queue.js',
    },
    {
      name: 'clipping',
      script: './dist/clipping.engine-queue.js',
    },
  ],
};

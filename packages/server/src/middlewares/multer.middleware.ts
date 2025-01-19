import multer from 'multer';

// Configure multer with increased file size limits for video uploads
export const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
});

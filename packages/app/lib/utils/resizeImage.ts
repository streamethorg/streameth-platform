/**
 * Resizes an image file to a specified width and height while maintaining aspect ratio.
 * If the image's aspect ratio doesn't match the target dimensions, black bars are added.
 *
 * @param file - The original image file to be resized.
 * @param [options] - Configuration options for the resize operation.
 * @param [options.width=1280] - The target width of the resized image in pixels.
 * @param [options.height=720] - The target height of the resized image in pixels.
 * @param [options.contentType='image/jpeg'] - The MIME type of the output image.
 * @param [options.quality=0.9] - The quality of the output image, between 0 and 1.
 * @returns {Promise<File>} A promise that resolves with the resized image as a new File object.
 * @throws If there's an issue loading the image or creating the resized version.
 */
export const resizeImage = async (
  file: File,
  options = {
    width: 1280,
    height: 720,
    contentType: 'image/jpeg',
    quality: 0.9,
  }
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = options.width;
      canvas.height = options.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;

      ctx.drawImage(img, x, y, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob'));
            return;
          }
          const resizedFile = new File([blob], file.name, {
            type: options.contentType,
            lastModified: new Date().getTime(),
          });
          resolve(resizedFile);
        },
        options.contentType,
        options.quality
      );
    };

    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsDataURL(file);
  });
};

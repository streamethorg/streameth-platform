/**
 * Resizes an image file to a specified width and height without stretching.
 * The image is scaled to fit within the target dimensions, and black bars are added to fill the remaining space.
 *
 * @param file - The original image file to be resized.
 * @param [options] - Configuration options for the resize operation.
 * @param [options.width=1280] - The target width of the resized image in pixels.
 * @param [options.height=720] - The target height of the resized image in pixels.
 * @param [options.contentType='image/jpeg'] - The MIME type of the output image.
 * @param [options.quality=0.9] - The quality of the output image, between 0 and 1.
 * @param [options.cover=false] - Whether to resize and crop the image to fit the specified dimensions.
 * @returns {Promise<File>} A promise that resolves with the resized image as a new File object.
 * @throws If there's an issue loading the image or creating the resized version.
 */
export const resizeImage = async (
  file: File,
  options: {
    width: number;
    height: number;
    contentType: string;
    quality: number;
    cover?: boolean;
  }
): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        if (options.cover) {
          const scale = Math.max(
            options.width / img.width,
            options.height / img.height
          );
          const x = options.width / 2 - (img.width / 2) * scale;
          const y = options.height / 2 - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        } else {
          ctx.drawImage(img, 0, 0, options.width, options.height);
        }

        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob!], file.name, {
              type: options.contentType,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          options.contentType,
          options.quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

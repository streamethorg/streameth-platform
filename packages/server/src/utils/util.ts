import path from 'path';
/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description this value is Empty Check
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== 'number' && value === '') {
    return true;
  } else if (typeof value === 'undefined' || value === undefined) {
    return true;
  } else if (
    value !== null &&
    typeof value === 'object' &&
    !Object.keys(value).length
  ) {
    return true;
  } else {
    return false;
  }
};
export const generateId = (key: string) => {
  // all lowercase, no spaces, no special characters
  return key
    ?.trim()
    .replace(/\s/g, '_')
    .replace(/[^\w\s]/g, '')
    .toLowerCase();
};

export const isEthereumAddress = (address: string): boolean => {
  const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  return ethereumAddressRegex.test(address);
};

export const PUBLIC_PATH = '../../../public';
export const IMAGE_BASE_PATH = path.join(process.cwd(), 'public');
export const BASE_PATH = path.join(process.cwd(), '../../data');

export async function fetchAndParseVTT(url: string) {
  try {
    // Fetch the VTT file
    const response = await fetch(url);
    const vttData = await response.text();

    // Parse the VTT data
    const keyframe = parseVTT(vttData);

    if (keyframe) {
      return keyframe;
    }
  } catch (error) {
    console.error('Error fetching or parsing VTT file:', error);
  }
}

export function parseVTT(vttData: string) {
  const lines = vttData.split('\n');
  let keyframe = null;

  // Extract the keyframe for the first time range
  lines.forEach((line) => {
    if (/^\d{2}:\d{2}:\d{2}/.test(line)) {
      // get the first keyframe
      keyframe = lines[lines.indexOf(line) + 1].trim();
      return;
    }
  });

  return keyframe;
}

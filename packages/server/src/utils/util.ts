import moment from 'moment';
import { customAlphabet } from 'nanoid';
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

export const getSourceType = (
  url: string,
): { header: Array<string>; type: string; resolutions?: Array<string> } => {
  const resolutions = [
    '364x640',
    '528x960',
    '576x1024',
    '720x1280',
    '1280x720',
    '1920x960',
    '1920x1080',
    '2560x1280',
  ];
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  const twitterRegex = /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+$/i;
  if (youtubeRegex.test(url)) {
    return {
      type: 'youtube',
      header: ['referer:youtube.com'],
      resolutions,
    };
  }
  if (twitterRegex.test(url)) {
    return {
      type: 'twitter',
      header: [],
      resolutions,
    };
  } else {
    return { type: 'custom', header: [] };
  }
};

export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${day}/${month}/${year}`;
};

export const getStartAndEndTime = (
  date: string,
  start: string,
  duration: string,
): { start: number; end: number } => {
  const startDate = moment(`${date.split('T')[0]}T${start}`);
  const [hours, minutes] = duration.split(':').map(Number);
  const endDate = startDate.clone().add(hours, 'hours').add(minutes, 'minutes');
  return {
    start: startDate.valueOf(),
    end: endDate.valueOf(),
  };
};

export const replacePlaceHolders = (template, data) => {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
};

export const generateDID = (): string => {
  const alphabets = '0123456789ABCDEFGHJKMNPQRSTVWXYZabcdefghjkmnpqrstvwxyz';
  const id = customAlphabet(alphabets, 25)();
  return `did:${id}`;
};

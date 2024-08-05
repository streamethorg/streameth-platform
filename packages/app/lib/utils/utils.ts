import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  IExtendedEvent,
  IExtendedNftCollections,
  IExtendedOrganization,
  IExtendedSession,
  IExtendedStage,
  IGenerateEmbed,
  IGenerateEmbedCode,
  eSort,
} from '@/lib/types';
import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface';
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface';
import { UseFormProps, UseFormReturn } from 'react-hook-form';
import { getDateInUTC } from './time';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const selectOptionFocusHandle = (
  event: React.KeyboardEvent<HTMLDivElement>,
  optionClickCallback: () => void,
  triggerClickCallback: () => void
): void => {
  if (event.key !== 'Tab') {
    event.preventDefault();
    optionClickCallback();
    triggerClickCallback();
  }
};

export const a11yEnterKeyPress = (
  event: React.KeyboardEvent,
  callback: () => void
) => {
  if (event.key === 'Enter') {
    callback();
  }
};

export const handleKeyPress = (
  event: React.KeyboardEvent,
  targetKey: string | string[],
  callback: () => void
): void => {
  if (Array.isArray(targetKey) && targetKey.includes(event.key)) {
    callback();
    return;
  }
  if (event.key === targetKey) {
    callback();
  }
};

export const listenPressOnElement = (
  event: React.KeyboardEvent<HTMLDivElement>,
  callback: () => void
) => event.which !== 9 && callback();

export const truncateAddr = (
  address: string,
  startLength = 6,
  endLength = 4
) => {
  if (!address) {
    return '';
  }
  const truncatedStart = address.substring(0, startLength);
  const truncatedEnd = address.substring(address.length - endLength);
  return `${truncatedStart}...${truncatedEnd}`;
};

export const hasData = ({ event }: { event: IExtendedEvent }) => {
  return event.dataImporter !== undefined;
};

export const getImageUrl = (image: string) => {
  const spaceStorage = process.env.NEXT_PUBLIC_SPACE_STORAGE_URL || null;
  if (!spaceStorage) {
    throw new Error('No SPACE STORAGE URL key found');
  }

  return spaceStorage + image;
};

export const loadEnv = () => {
  const key = process.env.LIVEPEER_API_KEY || null;
  if (!key) {
    throw new Error('No API key found');
  }
  return key;
};

export const apiUrl = () => {
  const api = process.env.NEXT_PUBLIC_API_URL || null;
  if (!api) {
    throw new Error('No API URL key found');
  }
  return api;
};

export const archivePath = ({
  organizationSlug,
  event,
  searchQuery,
}: {
  organizationSlug: IOrganizationModel['slug'];
  event?: IEventModel['slug'];
  searchQuery?: string;
}) => {
  const params = new URLSearchParams();
  let newSearchQueryPath;

  if (event) {
    params.append('event', event);
  }

  if (searchQuery) {
    // const url = new URL(window.location.href)
    //
    // if (
    //   (url.pathname === '/videos' && url.searchParams.has('event')) ||
    //   url.searchParams.has('organization')
    // ) {
    //   url.searchParams.set('searchQuery', searchQuery)
    //   newSearchQueryPath =
    //     // Iterate through existing parameters and include only 'event' and 'searchQuery'
    //     newSearchQueryPath = `${url.pathname}?${[
    //       ...url.searchParams.entries(),
    //     ]
    //       .filter(([key]) =>
    //         ['organization', 'event', 'searchQuery'].includes(key)
    //       )
    //       .map(([key, value]) => `${key}=${value}`)
    //       .join('&')}`
    // } else {
    //   params.append('searchQuery', searchQuery)
    // }

    params.append('searchQuery', searchQuery);
  }

  return organizationSlug
    ? `/${organizationSlug}/videos?${params.toString()}`
    : `/explore?${params.toString()}`
}

export const hasOrganization = (
  userOrganizations?: IExtendedOrganization[],
  searchParams?: string
) => {
  const hasOrganization = userOrganizations?.some(
    (organization) => organization.slug === searchParams
  );
  return hasOrganization;
};

export const validateEnv = (envVar: string) => {
  const value = process.env[envVar] || null;
  if (!value) {
    throw new Error(`No ${envVar} found`);
  }
  return value;
};

export const getFormSubmitStatus = (form: UseFormReturn<any>) => {
  const isSubmitDisabled =
    form.formState.isSubmitting ||
    Object.keys(form.formState.dirtyFields).length === 0;

  return isSubmitDisabled;
};

export const isEthereumAddress = (address: string) => {
  const ethereumAddressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
  return ethereumAddressRegex.test(address);
};

export const formatIdentify = (identity = '') => {
  const parsedIdentity = isEthereumAddress(identity)
    ? truncateAddr(identity)
    : identity;
  return parsedIdentity;
};
export const buildPlaybackUrl = (playbackId: string, vod?: boolean): string => {
  if (vod) {
    return `https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${playbackId}/index.m3u8`;
  }
  return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
};

export const isArchivedEvent = (endDate: string | Date) => {
  return getDateInUTC(new Date()) > getDateInUTC(new Date(endDate));
};

export const sortByStartDateAsc = (
  a: IExtendedEvent | IExtendedSession,
  b: IExtendedEvent
) => {
  const dateA = getDateInUTC(new Date(a.start));
  const dateB = getDateInUTC(new Date(b.start));

  if (dateA < dateB) {
    return -1;
  } else if (dateA > dateB) {
    return 1;
  } else {
    return 0;
  }
};

export const renderEventDay = (start: string | Date, end: string | Date) => {
  if (start === end) return new Date(start).toDateString();

  return `${new Date(start).toDateString()} - ${new Date(end).toDateString()}`;
};

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  toast('Copied to clipboard');
};

export const generateParams = ({
  playbackId,
  vod,
  streamId,
  playerName,
  sessionId,
  stageId,
}: IGenerateEmbed) => {
  const params = new URLSearchParams();
  playbackId && params.append('playbackId', playbackId ?? '');
  sessionId && params.append('session', sessionId ?? '');
  stageId && params.append('stage', stageId ?? '');
  params.append('vod', vod ? 'true' : 'false');
  params.append('streamId', streamId ?? '');
  params.append('playerName', playerName ?? '');

  return params.toString();
};

export const generateEmbedCode = ({
  url,
  playbackId,
  sessionId,
  stageId,
  vod,
  streamId,
  playerName,
}: IGenerateEmbedCode) => {
  return `<iframe src="${url}/embed/?${generateParams({
    playbackId,
    vod,
    streamId,
    playerName,
    sessionId,
    stageId,
  })}" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
};

export const sortArray = (
  stages: IExtendedStage[] | IExtendedSession[] | IExtendedNftCollections[],
  sortBy: string
) => {
  return stages.sort((a, b) => {
    if (sortBy) {
      switch (sortBy) {
        case eSort.asc_alpha:
          return a.name.localeCompare(b.name);
        case eSort.desc_alpha:
          return b.name.localeCompare(a.name);
        case eSort.asc_date:
          return (
            new Date(a.updatedAt!).getTime() - new Date(b.updatedAt!).getTime()
          );
        case eSort.desc_date:
          return (
            new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime()
          );
        default:
          return 0;
      }
    } else {
      return 0;
    }
  });
};

export const getVideoIndex = (
  all: boolean,
  nftCollection: IExtendedNftCollections,
  video?: IExtendedSession
) => {
  let videoIndex = [];

  // if (all) {
  //   videoIndex = nftCollection?.videos?.map((vid) => vid?.index) || []
  // } else {
  const index = nftCollection?.videos?.find(
    (vid) => vid.sessionId == video?._id || vid.stageId === video?._id
  )?.index;
  if (index !== undefined) {
    videoIndex.push(index);
  }
  // }

  return videoIndex;
};

export const calMintPrice = (
  data: { result: BigInt }[],
  all: boolean,
  nftCollection: IExtendedNftCollections
) => {
  if (data) {
    const mintFee = Number(data[0].result);
    const baseFee = Number(data[1].result);
    if (all) {
      const mintPrice = (mintFee + baseFee) * nftCollection?.videos?.length!;
      return mintPrice.toString();
    } else {
      return (mintFee + baseFee).toString();
    }
  }
  return null;
};

export const getTimeString = (date: Date | string | undefined) => {
  if (date)
    return new Date(date).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
};

export const constructYoutubeLiveRedirect = (userEmail: string): string => {
  const baseUrl = 'https://accounts.google.com/AccountChooser';
  const youtubeUrl = 'https://www.youtube.com/live_dashboard';

  const params = new URLSearchParams({
    continue: youtubeUrl,
    hl: 'en',
    service: 'youtube',
    theme: 'glif',
    flowName: 'GlifWebSignIn',
    flowEntry: 'ServiceLogin',
    Email: userEmail,
  });

  return `${baseUrl}?${params.toString()}`;
};

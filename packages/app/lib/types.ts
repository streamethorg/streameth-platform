import {
  IOrganization,
  ISocials,
} from 'streameth-new-server/src/interfaces/organization.interface';
import { IEvent } from 'streameth-new-server/src/interfaces/event.interface';
import { ISession } from 'streameth-new-server/src/interfaces/session.interface';
import { IStage } from 'streameth-new-server/src/interfaces/stage.interface';
import { ISpeaker } from 'streameth-new-server/src/interfaces/speaker.interface';
import { IState } from 'streameth-new-server/src/interfaces/state.interface';
import { IUser } from 'streameth-new-server/src/interfaces/user.interface';
import { IChat } from 'streameth-new-server/src/interfaces/chat.interface';
import { IMarker } from 'streameth-new-server/src/interfaces/marker.interface';
import { INftCollection } from 'streameth-new-server/src/interfaces/nft.collection.interface';
import { IScheduleImporter } from 'streameth-new-server/src/interfaces/schedule-importer.interface';
import Hls from 'hls.js';

export interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export interface PlaybackStatus {
  progress: number;
  offset: number;
}

export interface IHighlight {
  start: number;
  end: number;
  title: string;
}

export enum eSort {
  asc_alpha = 'asc_alpha',
  desc_alpha = 'desc_alpha',
  asc_date = 'asc_date',
  desc_date = 'desc_date',
}

export enum eLayout {
  grid = 'grid',
  list = 'list',
}

export interface Page {
  name: string;
  href: string;
  bgColor?: string;
  icon?: React.JSX.Element;
}
export interface NavBarProps {
  pages: Page[];
  logo: string;
  homePath: string;
  showNav: boolean;
}

export interface EventPageProps {
  params: {
    event: string;
    organization: string;
    stage?: string;
  };
  searchParams: {
    stage?: string;
    date?: string;
    page?: number;
  };
}
export interface SearchPageProps {
  searchParams: {
    organization?: IOrganization['slug'];
    event?: string;
    searchQuery?: string;
    page?: string;
  };
}

export interface OrganizationPageProps {
  params: {
    organization: string;
  };
  searchParams: {
    id: string;
    streamId: string;
    session: string;
    event?: string;
    searchQuery?: string;
    page?: string;
    collectionId?: string;
    stage?: string;
    speaker?: string;
  };
}

export interface WatchPageProps {
  searchParams: {
    event: string;
    session: string;
    assetId: string;
  };
}

export interface IPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}
export interface studioPageParams {
  params: {
    organization: string;
    session?: string;
    eventId?: string;
  };
  searchParams: {
    eventId?: string;
    settings: string;
    stage: string;
    stageSetting: string;
    streamId: string;
    collapsed?: boolean;
    hasChannel?: string;
  };
}

export interface nftPageParams {
  params: {
    organization: string;
    nftId?: string;
  };
}

export interface ClipsPageParams {
  params: {
    organization: string;
    stageId: string;
  };
  searchParams: {
    videoType: 'livestream' | 'recording' | 'customUrl';
    sessionId: string;
    stageId: string;
    // replaceAsset: string;
    previewId: string;
    type: string;
  };
}

export interface IGoogleAuth {
  web: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    redirect_uris: string[];
    javascript_origins: string[];
  };
}

export interface IExtendedEvent extends IEvent {
  _id: string;
}

interface IExtendedSocials extends ISocials {
  _id: string;
}
export interface IExtendedOrganization
  extends Omit<IOrganization, '_id' | 'socials'> {
  _id: string;
  socials?: IExtendedSocials[];
}
export interface IExtendedSession
  extends Omit<ISession, '_id' | 'nftCollections'> {
  _id: string;
  nftCollections?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
}
export interface IExtendedStage extends Omit<IStage, '_id' | 'nftCollections'> {
  _id?: string;
  nftCollections?: string[];
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
}
export interface IExtendedSpeaker extends Omit<ISpeaker, 'organizationId'> {}
export interface IExtendedUser extends Omit<IUser, 'organizations'> {
  _id: string;
  organizations: IExtendedOrganization[];
}
export interface IExtendedChat extends Omit<IChat, '_id'> {
  _id: string;
}

export interface IExtendedState extends Omit<IState, '_id'> {
  _id: string;
}

export interface IExtendedNftCollections extends Omit<INftCollection, '_id'> {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
}

export interface EmbedPageParams {
  searchParams: {
    vod: string;
    playbackId?: string;
    stage?: string;
    session?: string;
  };
}

export interface LivestreamPageParams {
  params: {
    organization: string;
    streamId: string;
  };
  searchParams: {
    layout: eLayout;
    sort: eSort;
    show: boolean;
    previewId: string;
  };
}

export interface IGenerateEmbed {
  playbackId?: string;
  vod?: boolean;
  streamId?: string;
  playerName: string;
  sessionId?: string;
  stageId?: string;
}

export interface IGenerateEmbedCode extends IGenerateEmbed {
  url: string;
}

export interface ChannelPageParams {
  params: {
    organization: string;
  };
  searchParams: {
    tab?: string;
    search: string;
    id: string;
    streamId: string;
    page?: string;
  };
}

export interface INFTSessions extends IExtendedSession {
  videoType: string;
}

interface ChunkTypes {
  text: string;
  timestamp: [number, number];
}

export interface ChunkDataTypes {
  chunks: ChunkTypes[];
  text: string;
}
export interface IExtendedScheduleImporter extends IScheduleImporter {
  _id: string;
}

export interface IExtendedMarker extends Omit<IMarker, '_id'> {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: string;
}

export type TimeSettings = {
  unix: number;
  displayTime: number;
};

export type ClipContextType = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  videoRef: React.RefObject<HTMLVideoElement>;
  dragging: string | null;
  setDragging: React.Dispatch<React.SetStateAction<string | null>>;
  selectedTooltip: string | null;
  setSelectedTooltip: React.Dispatch<React.SetStateAction<string | null>>;
  stageId?: string;
  isCreatingClip: boolean;
  setIsCreatingClip: React.Dispatch<React.SetStateAction<boolean>>;
  hls: Hls | null;
  setHls: React.Dispatch<React.SetStateAction<Hls | null>>;
  clipUrl: string;
  organizationId: string;
  playbackStatus: PlaybackStatus | null;
  setPlaybackStatus: React.Dispatch<
    React.SetStateAction<PlaybackStatus | null>
  >;
  isInputFocused: boolean;
  setIsInputFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

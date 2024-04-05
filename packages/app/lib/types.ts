import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { IEvent } from 'streameth-new-server/src/interfaces/event.interface'
import { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import {
  IStage,
  IStageModel,
} from 'streameth-new-server/src/interfaces/stage.interface'
import { ISpeaker } from 'streameth-new-server/src/interfaces/speaker.interface'
import { IState } from 'streameth-new-server/src/interfaces/state.interface'
import { IUser } from 'streameth-new-server/src/interfaces/user.interface'
import { IChat } from 'streameth-new-server/src/interfaces/chat.interface'

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
  name: string
  href: string
  bgColor?: string
  icon?: React.JSX.Element
}
export interface NavBarProps {
  pages: Page[]
  logo: string
  homePath: string
  showNav: boolean
}

export interface EventPageProps {
  params: {
    event: string
    organization: string
    stage?: string
  }
  searchParams: {
    stage?: string
    date?: string
    page?: number
  }
}
export interface SearchPageProps {
  searchParams: {
    organization?: IOrganization['slug']
    event?: string
    searchQuery?: string
    page?: string
  }
}

export interface WatchPageProps {
  searchParams: {
    event: string
    session: string
    assetId: string
  }
}

export interface IPagination {
  currentPage?: number
  totalPages: number
  totalItems: number
  limit: number
}
export interface studioPageParams {
  params: {
    organization: string
    session: string
    eventId?: string
  }
  searchParams: {
    eventId?: string
    settings: string
    stage: string
    stageSetting: string
    streamId: string
  }
}

export interface ClipsPageParams {
  params: {
    organization: string
    session: string
    eventId: string
  }
  searchParams: {
    stage: string
    selectedSession: string
    selectedRecording: string
    replaceAsset: string
    previewId: string
  }
}

export interface IGoogleAuth {
  web: {
    client_id: string
    project_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    client_secret: string
    redirect_uris: string[]
    javascript_origins: string[]
  }
}

export interface IExtendedEvent extends IEvent {
  _id: string
}
export interface IExtendedOrganization
  extends Omit<IOrganization, '_id'> {
  _id: string
}
export interface IExtendedSession extends Omit<ISession, '_id'> {
  _id: string
  createdAt?: string
}
export interface IExtendedStage extends Omit<IStage, '_id'> {
  _id?: string
  createdAt?: string
  updatedAt?: string
  __v?: string
}
export interface IExtendedSpeaker
  extends Omit<ISpeaker, 'organizationId'> {}
export interface IExtendedUser extends Omit<IUser, 'organizations'> {
  organizations: IExtendedOrganization[]
}
export interface IExtendedChat extends Omit<IChat, '_id'> {
  _id: string
}

export interface IExtendedState extends Omit<IState, '_id'> {
  _id: string
}

export interface EmbedPageParams {
  searchParams: {
    vod: string
    playbackId: string
  }
}

export interface LivestreamPageParams {
  params: {
    organization: string
    streamId: string
  }
}

export interface IGenerateEmbed {
  playbackId?: string
  vod?: boolean
  streamId?: string
  playerName: string
}

export interface IGenerateEmbedCode extends IGenerateEmbed {
  url: string
}

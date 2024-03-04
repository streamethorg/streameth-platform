import { IOrganization } from 'streameth-new-server/src/interfaces/organization.interface'
import { IEvent } from 'streameth-new-server/src/interfaces/event.interface'
import { ISession } from 'streameth-new-server/src/interfaces/session.interface'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import {
  ISpeaker,
  ISpeakerModel,
} from 'streameth-new-server/src/interfaces/speaker.interface'
import { IUser } from 'streameth-new-server/src/interfaces/user.interface'
import { IChat } from 'streameth-new-server/src/interfaces/chat.interface'

export interface Page {
  name: string
  href: string
  bgColor?: string
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
  }
  searchParams: {
    eventId: string
    settings: string
    stage: string
    stageSetting: string
  }
}

export interface ClipsPageParams {
  params: {
    organization: string
    session: string
  }
  searchParams: {
    eventId: string
    stage: string
    selectedSession: string
    selectedRecording: string
    replaceAsset: string
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

export interface IStage extends IStageModel {}
export interface IExtendedSpeaker
  extends Omit<ISpeaker, 'organizationId'> {}
export interface IExtendedUser extends Omit<IUser, 'organizations'> {
  organizations: IExtendedOrganization[]
}
export interface IExtendedChat extends Omit<IChat, '_id'> {
  _id: string
}

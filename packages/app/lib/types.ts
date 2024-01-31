import { IOrganizationModel } from "streameth-new-server/src/interfaces/organization.interface"
import { IEventModel } from "streameth-new-server/src/interfaces/event.interface"
import { ISessionModel } from "streameth-new-server/src/interfaces/session.interface"
import { IStageModel } from "streameth-new-server/src/interfaces/stage.interface"
import { ISpeakerModel } from "streameth-new-server/src/interfaces/speaker.interface"

export interface NavBarProps {
  pages: {
    name: string
    href: string
    bgColor?: string
  }[]
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
    organization?: IOrganizationModel["slug"]
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
  }
}
export interface IEvent extends IEventModel {}
export interface IOrganization extends IOrganizationModel {}
export interface ISession extends ISessionModel {}
export interface IStage extends IStageModel {}
export interface ISpeaker extends ISpeakerModel {}


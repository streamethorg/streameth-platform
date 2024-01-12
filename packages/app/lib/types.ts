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
    stage: string
  }
  searchParams: {
    stage?: string
    date?: string
  }
}
export interface SearchPageProps {
  searchParams: {
    organization?: string
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
  currentPage: number
  totalPages: number
  totalItems: number
  limit: number
}
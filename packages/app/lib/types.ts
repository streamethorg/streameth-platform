export interface NavBarProps {
  pages: {
    name: string
    href: string
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
  }
}
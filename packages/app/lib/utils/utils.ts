import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { IExtendedEvent, IExtendedOrganization } from '@/lib/types'
import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const selectOptionFocusHandle = (
  event: React.KeyboardEvent<HTMLDivElement>,
  optionClickCallback: () => void,
  triggerClickCallback: () => void
): void => {
  if (event.key !== 'Tab') {
    event.preventDefault()
    optionClickCallback()
    triggerClickCallback()
  }
}

export const a11yEnterKeyPress = (
  event: React.KeyboardEvent,
  callback: () => void
) => {
  if (event.key === 'Enter') {
    callback()
  }
}

export const handleKeyPress = (
  event: React.KeyboardEvent,
  targetKey: string | string[],
  callback: () => void
): void => {
  if (Array.isArray(targetKey) && targetKey.includes(event.key)) {
    callback()
    return
  }
  if (event.key === targetKey) {
    callback()
  }
}

export const listenPressOnElement = (
  event: React.KeyboardEvent<HTMLDivElement>,
  callback: () => void
) => event.which !== 9 && callback()

export const truncateAddr = (
  address: string,
  startLength = 6,
  endLength = 4
) => {
  if (!address) {
    return ''
  }
  const truncatedStart = address.substring(0, startLength)
  const truncatedEnd = address.substring(address.length - endLength)
  return `${truncatedStart}...${truncatedEnd}`
}

export const hasData = ({ event }: { event: IExtendedEvent }) => {
  return event.dataImporter !== undefined
}

export const getImageUrl = (image: string) => {
  const spaceStorage = process.env.SPACE_STORAGE_URL || null
  if (!spaceStorage) {
    throw new Error('No SPACE STORAGE URL key found')
  }
  return process.env.NEXT_PUBLIC_SPACE_STORAGE + '/' + image
}

export const loadEnv = () => {
  const key = process.env.LIVEPEER_API_KEY || null
  if (!key) {
    throw new Error('No API key found')
  }
  return key
}

export const apiUrl = () => {
  const api = process.env.NEXT_PUBLIC_API_URL || null
  if (!api) {
    throw new Error('No API URL key found')
  }
  return api
}

export const archivePath = ({
  organization,
  event,
  searchQuery,
}: {
  organization?: IOrganizationModel['slug']
  event?: IEventModel['slug']
  searchQuery?: string
}) => {
  const params = new URLSearchParams()
  let newSearchQueryPath

  if (organization) {
    params.append('organization', organization)
  }

  if (event) {
    params.append('event', event)
  }

  if (searchQuery) {
    const url = new URL(window.location.href)
    if (
      url.searchParams.has('event') ||
      url.searchParams.has('organization')
    ) {
      url.searchParams.set('searchQuery', searchQuery)
      newSearchQueryPath =
        // Iterate through existing parameters and include only 'event' and 'searchQuery'
        newSearchQueryPath = `${url.pathname}?${[
          ...url.searchParams.entries(),
        ]
          .filter(([key]) =>
            ['organization', 'event', 'searchQuery'].includes(key)
          )
          .map(([key, value]) => `${key}=${value}`)
          .join('&')}`
    } else {
      params.append('searchQuery', searchQuery)
    }
  }

  return newSearchQueryPath
    ? newSearchQueryPath
    : `/archive?${params.toString()}`
}

export const hasOrganization = (
  userOrganizations?: IExtendedOrganization[],
  searchParams?: string
) => {
  const hasOrganization = userOrganizations?.some(
    (organization) => organization.slug === searchParams
  )
  return hasOrganization
}

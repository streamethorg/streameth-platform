import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface'
import { IEventModel } from 'streameth-new-server/src/interfaces/event.interface'

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

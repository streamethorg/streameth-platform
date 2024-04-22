import { SearchPageProps } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import { fetchEvent } from '@/lib/services/eventService'
import { redirect } from 'next/navigation'
import {
  generalMetadata,
  archiveMetadata,
} from '@/lib/utils/metadata'
import { Metadata } from 'next'

export default async function ArchivePage({
  searchParams,
}: SearchPageProps) {
  if (searchParams.organization) {
    const organization = await fetchOrganization({
      organizationSlug: searchParams.organization,
    })

    if (!organization) {
      return redirect('/404')
    }

    return redirect(`/${organization.slug}/videos`)
  }

  if (searchParams.event) {
    const event = await fetchEvent({
      eventSlug: searchParams.event,
    })

    const organization = await fetchOrganization({
      organizationId: event?.organizationId as string,
    })

    if (!event || !organization) {
      return redirect('/404')
    }

    return redirect(`/${organization.slug}/archive`)
  }

  return <>Page moved</>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  if (!searchParams.event) return generalMetadata
  const event = await fetchEvent({
    eventSlug: searchParams.event,
  })

  if (!event) return generalMetadata
  return archiveMetadata({ event })
}

import { WatchPageProps } from '@/lib/types'
import { Metadata } from 'next'
import { apiUrl } from '@/lib/utils/utils'
import { notFound } from 'next/navigation'
import { generalMetadata, watchMetadata } from '@/lib/utils/metadata'
import { fetchSession } from '@/lib/services/sessionService'
import { redirect } from 'next/navigation'
import { fetchOrganization } from '@/lib/services/organizationService'
export default async function Watch({
  searchParams,
}: WatchPageProps) {
  if (!searchParams.session) return notFound()
  const video = await fetchSession({
    session: searchParams.session,
  })

  if (!video) return notFound()
  const organization = await fetchOrganization({
    organizationId: video.organizationId as string,
  })
  if (!organization) {
    return notFound()
  }

  redirect(
    `/${organization.slug}/watch?session=${searchParams.session}`
  )
  return 'loading...'
}

export async function generateMetadata({
  searchParams,
}: WatchPageProps): Promise<Metadata> {
  const response = await fetch(
    `${apiUrl()}/sessions/${searchParams.session}`
  )
  const responseData = await response.json()
  const video = responseData.data

  if (!searchParams.session) return generalMetadata

  if (!video) return generalMetadata
  return watchMetadata({ session: video })
}

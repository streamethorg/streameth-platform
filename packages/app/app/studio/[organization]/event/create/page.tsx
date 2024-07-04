import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import CreateEventForm from './components/createEventForm'
import { studioPageParams } from '@/lib/types'
import { notFound } from 'next/navigation'
import { fetchOrganization } from '@/lib/services/organizationService'

const CreateEventPage = async ({ params }: studioPageParams) => {
  if (!params.organization) {
    return notFound()
  }

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return notFound()
  }

  return (
    <div className="h-full w-full p-4">
      <CreateEventForm organization={organization} />
    </div>
  )
}

export default CreateEventPage

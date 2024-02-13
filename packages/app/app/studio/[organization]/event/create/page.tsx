import { Card, CardContent, CardHeader } from '@/components/ui/card'
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
    <div className="w-full h-full overflow-auto bg-secondary flex justify-center items-center">
      <Card className="p-4">
        <CardContent>
          <CreateEventForm organizationId={organization._id} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateEventPage

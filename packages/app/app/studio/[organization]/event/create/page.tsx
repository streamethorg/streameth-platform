import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CreateEventForm from './components/createEventForm'
import { studioPageParams } from '@/lib/types'
import { notFound } from 'next/navigation'

const CreateEventPage = ({ params }: studioPageParams) => {
  if (!params.organization) {
    return notFound()
  }

  return (
    <div className="w-full h-full overflow-scroll bg-secondary flex justify-center items-center">
      <Card className="p-4">
        <CardContent>
          <CreateEventForm organizationId={params.organization} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateEventPage

import { studioPageParams } from '@/lib/types'
import { fetchEvent } from '@/lib/services/eventService'
import { fetchEventStages } from '@/lib/services/stageService'
import UploadVideoForm from './components/UploadVideoForm'
import {
  CardHeader,
  Card,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
const Upload = async ({ params, searchParams }: studioPageParams) => {
  const { eventId } = searchParams
  const { organization } = params

  const event = await fetchEvent({ eventId })
  if (!event) {
    return
  }

  const stages = await fetchEventStages({
    eventId,
  })
  if (!(stages.length > 0)) {
    return <div>No stages found</div>
  }

  return (
    <div className="w-full h-full">
      <Card className="w-full max-w-4xl shadow-none border-secondary m-auto my-4 ">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Upload Video</CardTitle>
          <Link href={`/studio/${organization}`}>
            <Button variant={'link'}>Back</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <UploadVideoForm
            eventId={event._id}
            organizationSlug={organization}
            organizationId={event.organizationId as string}
            stageId={stages[0]._id}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Upload

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import CreateSession from '../../../../library/create/CreateSession'

const NoSession = async ({
  organization,
  eventId,
  stageId,
  organizationSlug,
}: {
  organizationSlug: string
  organization: string
  eventId: string
  stageId: string
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Card className="">
        <CardContent>
          <div className="text-2xl mb-4 text-center w-full">
            No sessions yet
          </div>
          <div className="flex flex-row space-x-2">
            <Link
              href={`/studio/${organizationSlug}/event/${eventId}?settings=event`}>
              <Button>Cancel</Button>
            </Link>
            <CreateSession
              eventId={eventId}
              stageId={stageId}
              organizationId={organization}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NoSession

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const NoSession = ({
  organization,
  eventId,
}: {
  organization: string
  eventId: string
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="">
        <CardContent>
          <div className="text-2xl mb-4 text-center w-full">
            No sessions yet
          </div>
          <div className="flex flex-row space-x-2">
            <Link href={`studio/${organization}?eventId=${eventId}`}>
              <Button>Cancel</Button>
            </Link>
            <Button variant={'default'} className="w-full">
              Create new session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default NoSession

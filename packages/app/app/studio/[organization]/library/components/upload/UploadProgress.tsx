import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import Alert from '@/components/misc/interact/Alert'
import { Button } from '@/components/ui/button'
import { type ISession } from 'streameth-new-server/src/interfaces/session.interface'
import { Card, CardTitle } from '@/components/ui/card'

const UploadProgress = ({
  organization,
  session,
  progress,
  handleCancel,
}: {
  organization: string
  session: ISession
  progress: number
  handleCancel: () => void
}) => {
  return (
    <>
      {progress < 100 ? (
        <Card className="my-2 flex w-full flex-col items-center justify-center bg-gray-200 p-2 px-4">
          <CardTitle className="font-medium">{progress}%</CardTitle>
          <Progress value={progress} className="mb-4 mt-2" />
          <Alert
            triggerText="Cancel upload..."
            dialogTitle="Are you sure to cancel the upload?"
            dialogDescription=""
            continueClick={() => handleCancel()}
          />
        </Card>
      ) : (
        <Card className="my-2 flex w-full justify-between bg-gray-200 p-2 px-4">
          <Button asChild>
            <Link
              href={`/studio/${organization}/library/${session!._id?.toString()}/edit`}>
              Go to the video...
            </Link>
          </Button>

          <Button disabled>Upload another video...</Button>
        </Card>
      )}
    </>
  )
}

export default UploadProgress

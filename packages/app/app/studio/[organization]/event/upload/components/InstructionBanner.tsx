import { Card, CardDescription } from '@/components/ui/card'

const InstructionBanner = ({ progress }: { progress: number }) => {
  return (
    <>
      {progress < 100 ? (
        <Card className="p-4 my-2 w-full bg-orange-400">
          <CardDescription className="text-black">
            Do not leave this page until the video is uploaded!
          </CardDescription>
        </Card>
      ) : (
        <Card className="p-4 my-2 w-full bg-green-400">
          <CardDescription className="text-black">
            Video uploaded! You can leave this page. 🎉
          </CardDescription>
        </Card>
      )}
    </>
  )
}

export default InstructionBanner

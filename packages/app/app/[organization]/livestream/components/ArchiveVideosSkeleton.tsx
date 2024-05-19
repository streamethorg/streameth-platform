import {
  Card,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'

const ArchiveVideoSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="border-none shadow-none">
          <div className="min-h-full uppercase rounded-xl">
            <div className="w-full animate-pulse bg-secondary aspect-video"></div>
            <CardHeader className="px-2 mt-1 bg-white bg-opacity-10 rounded lg:p-0 lg:py-2">
              <div className="flex flex-col space-y-2">
                <div className="w-full h-5 animate-pulse bg-secondary" />
                <div className="w-1/2 h-5 animate-pulse bg-secondary" />
              </div>
            </CardHeader>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ArchiveVideoSkeleton

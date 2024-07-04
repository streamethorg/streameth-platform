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
          <div className="min-h-full rounded-xl uppercase">
            <div className="aspect-video w-full animate-pulse bg-secondary"></div>
            <CardHeader className="mt-1 rounded bg-white bg-opacity-10 px-2 lg:p-0 lg:py-2">
              <div className="flex flex-col space-y-2">
                <div className="h-5 w-full animate-pulse bg-secondary" />
                <div className="h-5 w-1/2 animate-pulse bg-secondary" />
              </div>
            </CardHeader>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default ArchiveVideoSkeleton

import PaginationSkeleton from './PaginationSkeleteon'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const ArchiveVideoSkeleton = () => {
  return (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <CardTitle className="">Results</CardTitle>
        <PaginationSkeleton />
      </div>
      <div className="flex flex-row overflow-auto space-x-4 ">
        {[...Array(8)].map((_, index) => (
          <div key={index}>
            <Card className="p-2 w-[350px]  border-none text-foreground">
              <div className=" min-h-full rounded-xl  uppercase">
                <div className="w-full animate-pulse bg-secondary aspect-video"></div>
                <CardHeader className=" px-2 lg:px-2 lg:py-2  rounded mt-1 bg-white bg-opacity-10 space-y-4">
                  <CardTitle className="truncate text-body text-white text-xl bg-secondary"></CardTitle>
                  <CardDescription className="text-white flex flex-row space-x-2 ">
                    <div className="w-full animate-pulse bg-secondary"></div>
                    <div className="w-full animate-pulse bg-secondary">
                      Archive
                    </div>
                  </CardDescription>
                </CardHeader>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArchiveVideoSkeleton

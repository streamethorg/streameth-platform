import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const UpcomingLoader = () => (
  <div className="max-w-screen border-none">
    <CardHeader className="px-0 lg:px-0">
      <CardTitle className=" ">Events</CardTitle>
      <CardDescription>
        Explore current and past events
      </CardDescription>
    </CardHeader>
    <CardContent className="px-0 lg:px-0 flex flex-row overflow-auto space-x-4 ">
      {[...Array(3)].map((_, index) => (
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
    </CardContent>
  </div>
)

export default UpcomingLoader

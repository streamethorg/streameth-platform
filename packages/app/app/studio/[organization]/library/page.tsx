import { fetchAllSessions } from '@/lib/data'
import {
  CardHeader,
  CardTitle,
  Card,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import { studioPageParams } from '@/lib/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Thumbnail from '@/components/misc/VideoCard/thumbnail'
const Library = async ({
  params,
  searchParams,
}: studioPageParams) => {
  const sessions = (
    await fetchAllSessions({
      organizationSlug: params.organization,
    })
  ).sessions

  if (!sessions)
    return (
      <div>
        <h1>No sessions found</h1>
      </div>
    )

  return (
    <div className="max-w-full h-full w-full mx-auto  p-4">
      <div className="w-full flex flex-row justify-between items-center pb-2">
        <CardTitle>Library</CardTitle>
        <Button disabled>Upload video</Button>
      </div>
      <div className="grid grid-cols-4 gap-4 h-[calc(100%-60px)] overflow-auto">
        {sessions?.map((session, index) => {
          return (
            <Link
              key={index}
              href={`/studio/${params.organization}/library/${session._id}/edit`}>
              <Card className="flex overflow-hidden flex-col border border-secondary">
                <CardHeader className=" relative p-0 lg:p-0 h-full">
                  <Thumbnail imageUrl={session.coverImage} />
                </CardHeader>
                <CardContent className="w-full flex flex-col justify-center p-2 lg:p-3">
                  <CardTitle className={`text-sm truncate`}>
                    {session.name}
                  </CardTitle>
                  <CardDescription>
                    {session.assetId ? 'Has video' : 'No video'}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
        {sessions.length === 0 && (
          <div className="flex flex-row justify-center items-center w-full h-full">
            <p>No sessions yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Library

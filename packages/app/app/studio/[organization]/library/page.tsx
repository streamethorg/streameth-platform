import { fetchAllSessions } from '@/lib/data'
import { studioPageParams } from '@/lib/types'
import VideoCard from '@/components/misc/VideoCard'
import Link from 'next/link'

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
    <div className="p-4 h-full">
      <h1>Library</h1>
      <div className="grid grid-cols-4 gap-4">
        {sessions.map((session, index) => (
          <Link
            key={index}
            href={`library/${session._id}/edit`}
            className="border ">
            {session.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Library

import { ISession } from '@server/model/session'
import Link from 'next/link'
import Card from '@/components/misc/Card'
import Image from 'next/image'
import { getImageUrl } from '@/utils'

const ArchivedSession = ({
  session,
  learnMore = false,
  goToStage = false,
  coverImage,
}: {
  session: ISession
  learnMore?: boolean
  goToStage?: boolean
  coverImage: string
}) => {
  const component = (
    <Card>
      <div className="aspect-video relative w-full">
        <Image
          unoptimized
          width={200}
          height={200}
          src={
            session.coverImage
              ? getImageUrl(session.coverImage)
              : getImageUrl(coverImage)
          }
          className="rounded object-cover w-full h-full"
          alt={session.name}
          onError={(e) => {
            e.currentTarget.src = getImageUrl('/events/' + coverImage)
          }}
        />
      </div>
      <p className=" p-2 py-4 flex flex-grow text-md ">
        {session.name}
      </p>
    </Card>
  )

  if (learnMore)
    return <Link href={'session/' + session.id}>{component}</Link>
  if (goToStage)
    return <Link href={'/stage/' + session.stageId}>{component}</Link>

  return component
}

export default ArchivedSession

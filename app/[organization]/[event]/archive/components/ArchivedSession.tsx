import { ISession } from '@/server/model/session'
import Link from 'next/link'
import Card from '@/components/misc/Card'

const ArchivedSession = ({
  session,
  learnMore = false,
  goToStage = false,
}: {
  session: ISession
  learnMore?: boolean
  goToStage?: boolean
}) => {
  const component = (
    <Card>
      <div className="aspect-video relative w-full">
        <img src={session.coverImage!} className="rounded object-cover w-full h-full" alt={session.name} />
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

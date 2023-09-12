import SessionController from '@/server/controller/session'
import SessionComponent from './components/SessionComponent'
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateStaticParams({ params }: { params: { organization: string; event: string } }) {
  const sessionController = new SessionController()
  const eventSessions = await sessionController.getAllSessions({eventId: params.event})

  return eventSessions.map((session) => ({
    organization: params.organization,
    event: params.event,
    session: session.id,
  }))
}

interface Params {
  params: {
    organization: string
    event: string
    session: string
  }
}

export default async function Page({ params }: Params) {
  const sController = new SessionController()
  const session = await sController.getSession(params.session, params.event)

  return <SessionComponent session={session} />
}

export async function generateMetadata({ params }: Params, parent: ResolvingMetadata): Promise<Metadata> {
  const sController = new SessionController()
  const session = await sController.getSession(params.session, params.event)
  const imageUrl = session.coverImage ? session.coverImage : session.id + '.png'
  try {
    return {
      title: `${session.name}`,
      description: session.description,
      openGraph: {
        images: [imageUrl],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: 'streameth session',
    }
  }
}

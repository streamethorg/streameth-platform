import SessionController from '@/server/controller/session'
import SessionComponent from './components/SessionComponent'
import type { Metadata, ResolvingMetadata } from 'next'
import EventController from '@/server/controller/event'

// export async function generateStaticParams({
//   params,
// }: {
//   params: { organization: string; event: string }
// }) {
//   const sessionController = new SessionController()
//   const eventSessions = await sessionController.getAllSessions({
//     eventId: params.event,
//   })

//   return eventSessions.map((session) => ({
//     organization: params.organization,
//     event: params.event,
//     session: session.id,
//   }))
// }

interface Params {
  params: {
    organization: string
    event: string
    session: string
  }
}

export default async function Page({ params }: Params) {
  // const eController = new EventController()
  // const event = await eController.getEvent(
  //   params.event,
  //   params.organization
  // )

  const sController = new SessionController()
  const session = await sController.getSession(
    params.session,
    params.event
  )
  const allSessions = await sController.getAllSessions({
    eventId: params.event,
  })

  const currentIndex = allSessions.findIndex(
    (s) => s.id === params.session
  )
  const nextSession =
    currentIndex !== -1 && allSessions[currentIndex + 1]
      ? allSessions[currentIndex + 1]
      : null

  return (
    <SessionComponent
      params={params.organization}
      // nextSession={nextSession}
      session={session}
      // event={event.toJson()}
    />
  )
}

export async function generateMetadata(
  { params }: Params,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const sController = new SessionController()
  const session = await sController.getSession(
    params.session,
    params.event
  )
  const imageUrl = session.coverImage
    ? session.coverImage
    : session.id + '.png'
  try {
    return {
      title: session.name,
      description: session.description,
      openGraph: {
        title: session.name,
        description: session.description,
        images: [imageUrl],
      },
    }
  } catch (e) {
    console.log(e)
    return {
      title: 'StreamETH Session',
      openGraph: {
        title: 'StreamETH Session',
        description:
          'The complete solution to host your hybrid or virtual event.',
      },
    }
  }
}

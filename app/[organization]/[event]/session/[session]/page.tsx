import SessionController from '@/server/controller/session'
import SessionComponent from './components/SessionComponent'

export async function generateStaticParams({ params }: { params: { organization: string; event: string } }) {
  const sessionController = new SessionController()
  const eventSessions = await sessionController.getAllSessions(params.event)

  return eventSessions.map((session) => ({
    organization: params.organization,
    event: params.event,
    session: session.id,
  }))
}

export default async function Page({
  params,
}: {
  params: {
    organization: string
    event: string
    session: string
  }
}) {
  const sController = new SessionController()
  const session = await sController.getSession(params.session, params.event)

  return <SessionComponent session={session} />
}

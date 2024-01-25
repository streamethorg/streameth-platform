import { notFound } from 'next/navigation'
import Navbar from '@/components/Layout/NavbarTop'
import { fetchNavBarRoutes, fetchEvent } from '@/lib/data'

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: {
    organization: string
    event: string
  }
}) => {
  const navbarRoutes = await fetchNavBarRoutes({
    event: params.event,
    organization: params.organization,
  })
  const event = await fetchEvent({
    eventSlug: params.event,
  })

  if (!event) {
    return notFound()
  }
  const style = {
    '--colors-accent': event.accentColor,
  } as React.CSSProperties

  return (
    <div
      className="h-full flex flex-col  z-1 min-h-screen "
      style={style}>
      <Navbar {...navbarRoutes} />
      <main className={` flex w-full ml-auto lg:h-full flex-grow`}>
        {children}
      </main>
    </div>
  )
}

export default Layout

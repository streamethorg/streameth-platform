import { notFound } from 'next/navigation'
import Navbar from '@/components/Layout/NavbarTop'
import { fetchNavBarRoutes } from '@/lib/data'
import { fetchEvent } from '@/lib/services/eventService'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
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
    backgroundColor: event.accentColor,
  } as React.CSSProperties

  return (
    <div
      className="w-full h-full flex flex-col  z-1 min-h-screen"
      style={style}>
      <HomePageNavbar
        pages={navbarRoutes.pages}
        showSearchBar={false}
      />
      <main
        className={` top-[74px] flex w-full ml-auto lg:h-full flex-grow`}>
        {children}
      </main>
    </div>
  )
}

export default Layout

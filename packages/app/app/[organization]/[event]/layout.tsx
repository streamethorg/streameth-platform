import ColorComponent from '@/components/Layout/ColorComponent'
import Navbar from '@/components/Layout/NavbarTop'
import { fetchNavBarRoutes, fetchEvent } from '@/lib/data-back'

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
    event: params.event,
    organization: params.organization,
  })
  return (
    <div className="h-full flex flex-col  z-1 min-h-screen ">
      <Navbar {...navbarRoutes} />

      <main className={` flex w-full ml-auto lg:h-full flex-grow`}>
        <ColorComponent accentColor={event.accentColor}>
          {children}
        </ColorComponent>
      </main>
    </div>
  )
}

export default Layout

import StudioPageNavbar from '@/components/Layout/StudioPageNavbar'
import SideNavigation from '@/components/Layout/SideNavigation'
import { File, Inbox } from 'lucide-react'
import { studioPageParams } from '@/lib/types'
import { headers } from 'next/headers'
import { cookies } from 'next/headers'

export type variant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'

const Layout = ({
  children,
  params,
}: {
  children: React.ReactNode
  params: studioPageParams['params']
}) => {
  const userSession = cookies().get('user-session')
  if (!userSession?.value) {
    return <>Unauthroised</>
  }

  const links = [
    {
      title: 'Home',
      icon: Inbox,
      variant: 'ghost' as variant,
      href: `/studio/${params.organization}`,
    },
    {
      title: 'Library',
      icon: File,
      variant: 'ghost' as variant,
      href: `/studio/${params.organization}/library`,
    },
    {
      title: 'Settings',
      icon: File,
      variant: 'ghost' as variant,
      href: `/studio/${params.organization}/settings`,
    },
  ]
  const headersList = headers()
  const pathname = headersList.get('next-url') || ''

  return (
    <div className="w-screen h-screen ">
      <StudioPageNavbar organization={params.organization}>
        <SideNavigation
          isCollapsed={false}
          links={links}
          currentPath={pathname}
        />
      </StudioPageNavbar>
      <div className="top-[74px] flex flex-col h-[calc(100vh-74px)]">
        <div className="flex flex-row h-full">
          <div className="flex flex-col flex-grow h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout

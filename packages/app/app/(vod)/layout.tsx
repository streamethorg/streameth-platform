import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import { Suspense } from 'react'
const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-screen h-screen max-w-screen-2xl mx-auto">
      <HomePageNavbar />
      <div className=" flex flex-col p-2 lg:p-4 overflow-scroll">
        <Suspense>{children}</Suspense>
      </div>
    </div>
  )
}

export default Layout

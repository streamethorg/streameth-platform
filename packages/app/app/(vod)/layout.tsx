import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'

import { Suspense } from 'react'
const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="mx-auto w-screen max-w-screen-2xl h-screen">
      <HomePageNavbar />
      <div className=" flex flex-col p-2 lg:p-4 overflow-scroll">
        <Suspense>{children}</Suspense>
      </div>
      <div className="sticky mb-5 top-[100vh]">
        <Footer />
      </div>
    </div>
  )
}

export default Layout

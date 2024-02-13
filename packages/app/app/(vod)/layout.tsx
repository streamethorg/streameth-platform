import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'

import { Suspense } from 'react'
const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pages = [
    {
      name: 'Videography',
      href: 'https://info.streameth.org/stream-eth-studio',
      bgColor: 'bg-muted ',
    },
    {
      name: 'Product',
      href: 'https://info.streameth.org/services',
      bgColor: 'bg-muted ',
    },
    {
      name: 'Host your event',
      href: 'https://info.streameth.org/contact-us',
      bgColor: 'bg-primary text-primary-foreground',
    },
    // {
    //   name: 'studio',
    //   href: '/studio/base',
    //   bgColor: 'bg-primary text-primary-foreground',
    // },
  ]

  return (
    <div className="mx-auto max-w-screen-2xl h-screen">
      <HomePageNavbar pages={pages} />
      <div className=" flex flex-col overflow-auto p-2 lg:p-4">
        <Suspense>{children}</Suspense>
      </div>
      <div className="sticky mb-5 top-[100vh]">
        <Footer />
      </div>
    </div>
  )
}

export default Layout

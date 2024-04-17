'use server'

import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'

const pages = [
  // {
  //   name: 'Videography',
  //   href: 'https://info.streameth.org/stream-eth-studio',
  //   bgColor: 'bg-muted ',
  // },
  // {
  //   name: 'Product',
  //   href: 'https://info.streameth.org/services',
  //   bgColor: 'bg-muted ',
  // },
  // {
  //   name: 'Host your event',
  //   href: 'https://info.streameth.org/contact-us',
  //   bgColor: 'bg-primary text-primary-foreground',
  // },
  {
    name: 'Videos',
    href: '/',
    bgColor: 'bg-muted',
  },
]

const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="mx-auto w-full bg-white">
      <HomePageNavbar pages={pages} />

      {children}

      <div className="sticky mb-5 top-[100vh]">
        <Footer />
      </div>
    </div>
  )
}

export default Layout

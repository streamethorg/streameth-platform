import Image from 'next/image'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'

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

const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-full">
      <HomePageNavbar pages={pages} showSearchBar={true} />
      <div className="top-[74px] flex flex-col p-4 overflow-scroll text-foreground">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout

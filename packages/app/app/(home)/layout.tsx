import Image from 'next/image'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'

const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-full">
      <HomePageNavbar />
      <div className="flex overflow-scroll flex-col p-2 lg:p-4 top-[74px]">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout

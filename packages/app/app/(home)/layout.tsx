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
      <div className="top-[74px] flex flex-col overflow-auto p-4 text-foreground">
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout

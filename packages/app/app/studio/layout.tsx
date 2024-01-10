import Image from 'next/image'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-screen h-screen ">
      <HomePageNavbar />
      <div className="top-[74px] flex flex-col overflow-scroll">
        {children}
      </div>
    </div>
  )
}

export default Layout

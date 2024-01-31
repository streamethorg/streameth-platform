import Image from 'next/image'
import HomePageNavbar from '@/components/Layout/HomePageNavbar'
const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-full ">
      <HomePageNavbar />
      <div className="top-[74px] flex flex-col p-2 lg:p-4 overflow-scroll text-foreground">
        {children}
      </div>
    </div>
  )
}

export default Layout

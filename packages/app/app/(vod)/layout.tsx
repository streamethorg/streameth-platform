import HomePageNavbar from '@/components/Layout/HomePageNavbar'
const Layout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <div className="w-screen h-screen bg-accent ">
      <HomePageNavbar />
      <div className=" flex flex-col p-2 md:p-4 overflow-scroll">
        {children}
      </div>
    </div>
  )
}

export default Layout

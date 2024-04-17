'use server'

import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'



const Layout = async ({
  params,
  children,
}: {
  params: { organization: string }
  children: React.ReactNode
}) => {

  const pages = [
    {
      name: 'Home',
      href: `/${params.organization}`,
      bgColor: 'bg-muted',
    },
    {
      name: 'Videos',
      href: `/${params.organization}/videos`,
      bgColor: 'bg-muted',
    },
  ]

  return (
    <div className="mx-auto min-h-[100vh] w-full bg-white flex flex-col">
      <HomePageNavbar
        currentOrganization={params.organization}
        pages={pages}
        showSearchBar
      />
      <div className=" w-full flex-grow h-full">{children}</div>
      <div className="sticky mb-5 top-[100vh]">
        <Footer />
      </div>
    </div>
  )
}

export default Layout

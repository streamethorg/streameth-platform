'use server'

import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'
import { fetchOrganization } from '@/lib/services/organizationService'
import NotFound from '@/not-found'

const Layout = async ({
  params,
  children,
}: {
  params: { organization: string }
  children: React.ReactNode
}) => {
  const org = params.organization === "livepeertv" ? "tv": params.organization
  const pages = [
    {
      name: 'Home',
      href: `/${org}`,
      bgColor: 'bg-muted',
    },
    {
      name: 'Videos',
      href: `/${org}/videos`,
      bgColor: 'bg-muted',
    },
  ]

  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) {
    return NotFound()
  }

  return (
    <div className="flex flex-col mx-auto w-full bg-white min-h-[100vh]">
      <HomePageNavbar
        logo={organization?.logo}
        currentOrganization={params.organization}
        pages={pages}
        showSearchBar
      />
      <div className="flex-grow w-full h-full">{children}</div>
      <div className="sticky mb-5 top-[100vh]">
        <Footer />
      </div>
    </div>
  )
}

export default Layout

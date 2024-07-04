'use server'

import HomePageNavbar from '@/components/Layout/HomePageNavbar'
import Footer from '@/components/Layout/Footer'
import { fetchOrganization } from '@/lib/services/organizationService'
import NotFound from '@/not-found'
import Support from '@/components/misc/Support'

const Layout = async ({
  params,
  children,
}: {
  params: { organization: string }
  children: React.ReactNode
}) => {
  const org = params.organization
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
    <div className="mx-auto flex min-h-[100vh] w-full flex-col bg-white">
      <HomePageNavbar
        logo={organization?.logo}
        currentOrganization={params.organization}
        pages={pages}
        showSearchBar
      />
      <div className="h-full w-full flex-grow">
        {children}
        <Support />
      </div>
      <div className="sticky top-[100vh] mb-5">
        <Footer />
      </div>
    </div>
  )
}

export default Layout

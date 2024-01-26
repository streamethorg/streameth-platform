import { fetchOrganization, fetchEvents } from '@/lib/data'
export interface studioPageParams {
  params: {
    organization: string
    stageId?: string
  }
  searchParams: {
    stage?: string
    date?: string
    page?: number
  }
}

const OrganizationPage = async ({ params }: studioPageParams) => {
  console.log('organization', params.organization)
  const events = await fetchEvents({
    organizationSlug: params.organization,
  })

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold text-center">
                {params.organization}
              </h1>
              <p className="text-xl text-center">
                {events.length} events
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrganizationPage

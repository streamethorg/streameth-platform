import { fetchOrganizations } from '@/lib/services/organizationService'
import { cookies } from 'next/headers'

const Studio = async () => {
  const userSession = cookies().get('user-session')
  if (!userSession?.value) {
    return <>Unauthroised</>
  }
  const organizations = await fetchOrganizations()

  return (
    <div className="flex flex-row p-4 h-full w-full">
      <h1>Studio</h1>
      <div className="grid grid-cols-3 gap-4">
        {organizations.map((organization) => (
          <div key={organization._id}>{organization.name}</div>
        ))}
      </div>
    </div>
  )
}

export default Studio

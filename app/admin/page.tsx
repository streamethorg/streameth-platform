import next from 'next'
import AddOrganizationButton from './components/AddOrganization'
import OrganizationEntry from './components/OrganizationEntry'
import { IOrganization } from '@/server/model/organization'
import { apiUrl } from '@/server/utils'

const OrganizationList = async () => {
  const organizations = await ((
    await fetch(`${apiUrl()}/organizations`, { cache: 'no-store' })
  ).json() as Promise<IOrganization[]>)
  return (
    <div className="h-full overflow-y-scroll ">
      <div className="flex flex-row sticky top-0 p-4 shadow bg-white items-center justify-between">
        <h2 className="text-2xl">Welcome back</h2>
        <AddOrganizationButton />
      </div>
      <ul className="space-y-4 p-4">
        {organizations.map((org) => (
          <OrganizationEntry key={org.id} organization={org} />
        ))}
      </ul>
    </div>
  )
}

export default OrganizationList

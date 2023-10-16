import AddOrganizationButton from './components/AddOrganization'
import OrganizationEntry from './components/OrganizationEntry'
import { IOrganization } from '@/server/model/organization'
import { apiUrl } from '@/server/utils'

const OrganizationList = async () => {
  const organizations = await ((await fetch(`${apiUrl()}/organizations`)).json() as Promise<IOrganization[]>)
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl">Welcome back</h2>
        <AddOrganizationButton />
      </div>
      <ul className="space-y-4 overflow-auto">
        {organizations.map((org) => (
          <OrganizationEntry key={org.id} organization={org} />
        ))}
      </ul>
    </div>
  )
}

export default OrganizationList

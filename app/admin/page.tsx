import AddOrganizationButton from './components/AddOrganization'
import OrganizationEntry from './components/OrganizationEntry'
import { IOrganization } from '@/server/model/organization'
import { apiUrl } from '@/server/utils'

const OrganizationList = async () => {
  const organizations = await ((await fetch(`${apiUrl()}/organizations`, { cache: 'no-store' })).json() as Promise<IOrganization[]>)
  return (
    <div className="p-4 overflow-scroll">
      <AddOrganizationButton />
      <ul className="space-y-4">
        {organizations.map((org) => (
          <OrganizationEntry key={org.id} organization={org} />
        ))}
      </ul>
    </div>
  )
}

export default OrganizationList

import AddOrganizationButton from './components/AddOrganization'
import OrganizationEntry from './components/OrganizationEntry'
import { IOrganization } from '@/server/model/organization'
import { apiUrl } from '@/server/utils'

const OrganizationList = async () => {
  let organizations: IOrganization[] = []
  await fetch(`${apiUrl()}/organizations`, { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) {
        return Promise.reject('Failed to fetch organizations')
      }
      return response.json()
    })
    .then((data) => (organizations = data))
    .catch((error) => {
      console.error(error)
    })
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

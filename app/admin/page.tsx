import OrganizationController from '@/server/controller/organization'
import AddOrganizationButton from './components/AddOrganization'
import OrganizationEntry from './components/OrganizationEntry'

const OrganizationList = async () => {
  const organizationController = new OrganizationController()
  const organizations =
    await organizationController.getAllOrganizations()
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl">Welcome back</h2>
        <AddOrganizationButton />
      </div>
      <ul className="space-y-4">
        {organizations.map((org) => (
          <OrganizationEntry key={org.id} organization={org} />
        ))}
      </ul>
    </div>
  )
}
export const revalidate = 0

export default OrganizationList

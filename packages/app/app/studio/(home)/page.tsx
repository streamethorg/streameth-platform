import { fetchOrganizations } from '@/lib/services/organizationService'
import { cookies } from 'next/headers'
import CreateOrganization from './components/CreateOrganizationForm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils/utils'
import { IOrganizationModel } from 'streameth-new-server/src/interfaces/organization.interface'
const Studio = async () => {
  const userSession = cookies().get('user-session')
  // if (!userSession?.value) {
  //   return <>Unauthroised</>
  // }
  const organizations = await fetchOrganizations()
  const logo = (organization: IOrganizationModel) => {
    if (organization.logo === 'lima.jpeg') {
      return getImageUrl('/organizations/' + organization.logo)
    }
    return organization.logo
  }

  return (
    <div className="flex flex-row p-4 h-full w-full">
      <h1>Studio</h1>
      <div className="grid grid-cols-3 gap-4">
        {organizations.map((organization) => (
          <Link
            key={organization._id}
            href={`/studio/${organization.slug}`}>
            <Card className="flex flex-row-reverse">
              <CardHeader>
                <CardTitle>{organization.name}</CardTitle>
                <CardDescription>
                  {organization.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Image
                  alt="logo"
                  src={logo(organization)}
                  height={1400}
                  width={400}
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <CreateOrganization />
    </div>
  )
}

export default Studio

import CreateOrganization from './components/CreateOrganizationForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { fetchUserAction } from '@/lib/actions/users'
import CheckAuthorization from '@/components/authorization/CheckAuthorization'
import AuthorizationMessage from '@/components/authorization/AuthorizationMessage'
import { IExtendedUser } from '@/lib/types'

const Studio = async () => {
  const isAuthorized = CheckAuthorization()

  if (!isAuthorized) {
    return <AuthorizationMessage />
  }
  const userData: IExtendedUser = await fetchUserAction({})

  return (
    <div className="flex flex-col p-4 w-full h-full">
      <div className="flex justify-between items-center mb-20">
        <h1>Studio</h1>
        <div className="flex items-center">
          <CreateOrganization />
          <Link href={'studio/user'}>
            <div className="mx-3 w-10 h-10 bg-black rounded-full"></div>
          </Link>
        </div>
      </div>
      {userData?.organizations?.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {userData?.organizations?.map((organization) => (
            <Link
              key={organization._id}
              href={`/studio/${organization.slug}`}>
              <Card className="flex overflow-hidden flex-row-reverse h-[200px]">
                <CardHeader>
                  <CardTitle>{organization.name}</CardTitle>
                  <CardDescription>
                    {organization.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Image
                    alt="logo"
                    src={organization.logo}
                    height={1400}
                    width={400}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-xl font-bold">
          Create an organization to get started
          <CreateOrganization />
        </div>
      )}
    </div>
  )
}

export default Studio

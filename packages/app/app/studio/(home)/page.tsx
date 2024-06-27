import CreateOrganizationForm from './components/CreateOrganizationForm'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { fetchUserAction } from '@/lib/actions/users'
import { IExtendedUser } from '@/lib/types'
import { Button } from '@/components/ui/button'

const Studio = async () => {
  const userData: IExtendedUser = await fetchUserAction({})

  return (
    <div className="flex flex-col h-full">
      <div className="flex overflow-auto flex-col flex-grow p-2 m-auto w-full max-w-4xl h-full bg-background">
        {userData?.organizations?.length > 0 ? (
          <>
            <div className="flex flex-row justify-between items-center py-2 w-full">
              <CardTitle> Your organizations</CardTitle>
              <Link href="/studio/create">
                <Button className="w-full">
                  Create Organization
                </Button>
              </Link>
            </div>
            <div className="flex overflow-auto flex-col space-y-2 h-full">
              {userData?.organizations?.map((organization) => (
                <Link
                  key={organization._id}
                  href={`/studio/${organization.slug}`}>
                  <Card className="flex overflow-hidden flex-row h-full rounded-xl border shadow-none border-secondary">
                    <CardHeader className="relative p-3 lg:p-3">
                      <Image
                        className="h-full rounded-full"
                        alt="logo"
                        src={organization.logo}
                        width={45}
                        height={30}
                      />
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center p-3 space-y-2 w-full h-full lg:p-3">
                      <p className="text-xl">{organization.name}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col justify-center items-center p-3 space-y-2 h-full lg:p-3">
                      <Button variant={'link'} className="w-full">
                        Manage
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <Card className="m-auto w-full border-secondary">
            <CardHeader>
              <CardTitle>
                Create an organization to get started
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CreateOrganizationForm />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Studio

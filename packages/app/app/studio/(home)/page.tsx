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
    <div className="flex h-full flex-col">
      <div className="flex flex-col flex-grow bg-background max-w-4xl w-full m-auto p-2 h-full overflow-auto">
        {userData?.organizations?.length > 0 ? (
          <>
            <div className="w-full flex flex-row justify-between items-center py-2">
              <CardTitle> Your organizations</CardTitle>
              <Link href="/studio/create">
                <Button className="w-full">
                  Create Organization
                </Button>
              </Link>
            </div>
            <div className="flex flex-col space-y-2 h-full overflow-auto">
              {userData?.organizations?.map((organization) => (
                <Link
                  key={organization._id}
                  href={`/studio/${organization.slug}`}>
                  <Card className="h-full flex overflow-hidden flex-row shadow-none rounded-xl border border-secondary ">
                    <CardHeader className=" relative p-3 lg:p-3">
                      <Image
                        className="rounded-full h-full"
                        alt="logo"
                        src={organization.logo}
                        width={45}
                        height={30}
                      />
                    </CardHeader>
                    <CardContent className="w-full space-y-2 h-full flex flex-col p-3 lg:p-3  justify-center">
                      <p className="text-xl">{organization.name}</p>
                    </CardContent>
                    <CardFooter className="space-y-2 h-full flex flex-col p-3 lg:p-3 items-center justify-center">
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
          <Card className="w-full m-auto border-secondary">
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

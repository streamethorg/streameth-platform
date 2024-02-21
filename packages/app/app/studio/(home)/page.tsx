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
            <div className="flex flex-col space-y-2">
              {userData?.organizations?.map((organization) => (
                <Link
                  key={organization._id}
                  href={`/studio/${organization.slug}`}>
                  <Card className="flex overflow-hidden flex-row border border-secondary">
                    <CardHeader className=" relative ">
                      <Image
                        className="rounded-full min-w-[50px]"
                        alt="logo"
                        src={organization.logo}
                        width={50}
                        height={50}
                      />
                    </CardHeader>
                    <CardContent className="p-2 space-y-2 h-full flex flex-col">
                      <CardTitle>{organization.name}</CardTitle>
                      <p className=" overflow-hidden max-h-10 h-full flex">
                        {organization.description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col"></CardFooter>
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

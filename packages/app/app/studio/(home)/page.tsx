import CreateOrganizationForm from './components/CreateOrganizationForm';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { fetchUserAction } from '@/lib/actions/users';
import { IExtendedUser } from '@/lib/types';
import { Button } from '@/components/ui/button';

const Studio = async () => {
  const userData: IExtendedUser = await fetchUserAction({});

  return (
    <div className="flex h-full flex-col">
      <div className="bg-background m-auto flex h-full w-full max-w-4xl flex-grow flex-col overflow-auto p-2">
        {userData?.organizations?.length > 0 ? (
          <>
            <div className="flex w-full flex-row items-center justify-between py-2">
              <CardTitle> Your organizations</CardTitle>
              <Link href="/studio/create">
                <Button className="w-full">Create Organization</Button>
              </Link>
            </div>
            <div className="flex h-full flex-col space-y-2 overflow-auto">
              {userData?.organizations?.map((organization) => (
                <Link
                  key={organization._id}
                  href={`/studio/${organization.slug}`}
                >
                  <Card className="border-secondary flex h-full flex-row overflow-hidden rounded-xl border shadow-none">
                    <CardHeader className="relative p-3 lg:p-3">
                      <Image
                        className="h-full rounded-full"
                        alt="logo"
                        src={organization.logo}
                        width={45}
                        height={30}
                      />
                    </CardHeader>
                    <CardContent className="flex h-full w-full flex-col justify-center space-y-2 p-3 lg:p-3">
                      <p className="text-xl">{organization.name}</p>
                    </CardContent>
                    <CardFooter className="flex h-full flex-col items-center justify-center space-y-2 p-3 lg:p-3">
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
          <Card className="border-secondary m-auto w-full">
            <CardHeader>
              <CardTitle>Create an organization to get started</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateOrganizationForm />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Studio;

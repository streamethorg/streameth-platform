import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { fetchUserAction } from '@/lib/actions/users';
import { IExtendedUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import JoinOrganizationForm from './components/JoinOrganizationForm';
import CreateOrganizationForm from './components/CreateOrganizationForm';

const Studio = async () => {
  const userData: IExtendedUser | null = await fetchUserAction();

  if (!userData) {
    redirect('/auth/login');
  }

  if (userData?.organizations?.length === 1) {
    redirect(`/studio/${userData.organizations[0].slug}`);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="m-auto flex h-full w-full max-w-4xl flex-grow flex-col overflow-auto bg-background p-2">
        {userData?.organizations?.length > 0 ? (
          <>
            <div className="flex w-full flex-row items-center justify-between py-2">
              <CardTitle>Your organizations</CardTitle>
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
                  <Card className="flex h-full flex-row overflow-hidden rounded-xl border border-secondary shadow-none">
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
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="mx-auto mt-12 flex w-full max-w-4xl flex-col space-y-8">
            <div className="flex flex-row">
              <div className="w-1/3 space-y-4 rounded-l-xl bg-neutrals-100 p-6">
                <Image src="/logo.png" alt="streameth logo" height={50} width={50} />
                <h1 className="text-2xl font-medium">Create an organization</h1>
                <p className="text-sm text-muted-foreground">
                  Organizations are used to manage events and videos. You can create
                  multiple organizations to manage different types of events.
                </p>
              </div>
              <Card className="m-auto w-2/3 rounded-r-xl border-none bg-white shadow-none">
                <CardContent>
                  <CreateOrganizationForm userAddress={userData?.email!} />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-row">
              <div className="w-1/3 space-y-4 rounded-l-xl bg-neutrals-100 p-6">
                <h1 className="text-2xl font-medium">Join an organization</h1>
                <p className="text-sm text-muted-foreground">
                  Have an invitation code? Join an existing organization to collaborate with others.
                </p>
              </div>
              <Card className="m-auto w-2/3 rounded-r-xl border-none bg-white shadow-none">
                <CardContent>
                  <JoinOrganizationForm userEmail={userData?.email!} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Studio;

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { fetchOrganization } from '@/lib/services/organizationService';
import Image from 'next/image';
import { SiX, SiYoutube } from 'react-icons/si';
import { LuRadio } from 'react-icons/lu';

const AddDestination = dynamic(() => import('./components/AddDestination'), {
  ssr: false,
});
const DeleteDestination = dynamic(
  () => import('./components/DeleteDestination'),
  { ssr: false }
);

const Destinations = async ({
  params,
}: {
  params: { organization: string };
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) return null;

  const renderSocialTypeIcon = (type: string) => {
    const className = 'absolute right-0 bottom-0';
    switch (type) {
      case 'youtube':
        return <SiYoutube color="#FF0000" className={className} />;
      case 'twitter':
        return null;
      default:
        return <LuRadio color="#000" className={className} />;
    }
  };

  return (
    <div className="mx-auto mt-12 flex flex-col h-[90%] w-full max-w-4xl">
      <AddDestination
        organization={{ ...organization, slug: organization.slug || '' }}
      />

      <Card className="w-full rounded-xl border bg-white shadow-none">
        <CardHeader>
          <CardTitle>Connected Destinations</CardTitle>
          <CardDescription className="mt-2">
            Manage your connected social destinations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table className="mt-4">
            <TableHeader className="sticky top-0 z-50 border-separate bg-gray-100">
              <TableRow className="hover:bg-whiterounded-t-xl border-b">
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organization?.socials?.map(({ _id, name, type, thumbnail }) => (
                <TableRow key={_id}>
                  <TableCell className="flex items-center gap-4">
                    <div className="relative">
                      {type === 'twitter' ? (
                        <div className="bg-black w-[50px] h-[50px] rounded-full">
                          <SiX color="#fff" className="w-full h-full p-3" />
                        </div>
                      ) : thumbnail ? (
                        <Image
                          className="rounded-full"
                          src={thumbnail}
                          width={50}
                          height={50}
                          alt={type}
                        />
                      ) : (
                        <div className="w-[50px] h-[50px] rounded-full bg-gray-200" />
                      )}
                      {renderSocialTypeIcon(type)}
                    </div>

                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-ext-muted text-sm capitalize">
                        {type}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DeleteDestination
                      destinationId={_id}
                      organizationId={organization._id}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Destinations;

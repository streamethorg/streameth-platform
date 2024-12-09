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
import { SiX } from 'react-icons/si';
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
        return (
          <Image
            src={'/images/youtube_social_icon_red.png'}
            alt="youtube_social_icon"
            width={20}
            height={20}
            className={className}
          />
        );
      case 'twitter':
        return null;
      default:
        return <LuRadio color="#000" className={className} />;
    }
  };

  return (
    <div className=" p-4 flex flex-col h-[90%] w-full max-w-4xl">
      <AddDestination
        organization={{ ...organization, slug: organization.slug || '' }}
      />

      <Card className="w-full bg-white rounded-xl border shadow-none">
        <CardHeader>
          <CardTitle>Connected Destinations</CardTitle>
          <CardDescription className="mt-2">
            Manage your connected social destinations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Table className="mt-4">
            <TableHeader className="sticky top-0 z-50 bg-gray-100 border-separate">
              <TableRow className="border-b hover:bg-whiterounded-t-xl">
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organization?.socials?.map(({ _id, name, type, thumbnail }) => (
                <TableRow key={_id}>
                  <TableCell className="flex gap-4 items-center">
                    <div className="relative">
                      {type === 'twitter' ? (
                        <div className="bg-black rounded-full w-[50px] h-[50px]">
                          <SiX color="#fff" className="p-3 w-full h-full" />
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
                        <div className="bg-gray-200 rounded-full w-[50px] h-[50px]" />
                      )}
                      {renderSocialTypeIcon(type)}
                    </div>

                    <div>
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm capitalize text-ext-muted">
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

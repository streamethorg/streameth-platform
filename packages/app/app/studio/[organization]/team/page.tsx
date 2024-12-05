import React from 'react';
import { studioPageParams } from '@/lib/types';
import { fetchOrganization } from '@/lib/services/organizationService';
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { fetchOrganizationMembers } from '@/lib/services/organizationService';
import AddTeamMembers from './components/AddTeamMembers';
import DeleteTeamMember from './components/DeleteTeamMember';
import { truncateAddr } from '@/lib/utils/utils';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';

const Settings = async ({
  params,
  searchParams,
}: {
  params: studioPageParams['params'];
  searchParams: {
    settingsActiveTab?: string;
  };
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) return null;

  const members = await fetchOrganizationMembers({
    organizationId: organization._id,
  });

  return (
    <div className="flex p-4 w-full max-w-4xl h-full">
      <Card className="w-full h-full bg-white rounded-r-xl border shadow-none md:p-0">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Team members</CardTitle>
            <CardDescription className="mt-2 mb-4">
              Invite your team members to collaborate.
            </CardDescription>
          </div>
          <div className="flex justify-end p-4">
            <AddTeamMembers organizationId={organization._id} />
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-0 lg:p-0">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 bg-gray-100 border-separate">
              <TableRow className="border-b hover:bg-whiterounded-t-xl">
                <TableHead>Email</TableHead>
                <TableHead className="w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map(({ _id, email }) => (
                <TableRow key={_id}>
                  <TableCell>{email}</TableCell>

                  <TableCell>
                    <DeleteTeamMember
                      memberEmail={email as string}
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

export default Settings;

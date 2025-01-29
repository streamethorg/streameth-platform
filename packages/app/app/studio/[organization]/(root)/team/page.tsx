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
    <div className="p-4 flex h-full w-full max-w-4xl">
      <Card className="w-full h-full rounded-r-xl border bg-white shadow-none md:p-0 flex flex-col">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Team members</CardTitle>
            <CardDescription className="mb-4 mt-2">
              Invite your team members to collaborate.
            </CardDescription>
          </div>
          <div className="flex justify-end p-4">
            <AddTeamMembers organizationId={organization._id} />
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-0 lg:p-0 flex-1 overflow-auto">
          <div className="h-full overflow-auto">
            <Table className="w-full">
              <TableHeader className="sticky top-0 z-10 border-separate bg-gray-100">
                <TableRow className="hover:bg-whiterounded-t-xl border-b">
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members?.map(({ _id, email, role }) => (
                  <TableRow key={_id}>
                    <TableCell>{email}</TableCell>
                    <TableCell>{role}</TableCell>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

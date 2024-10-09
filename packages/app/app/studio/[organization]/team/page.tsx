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
    <div className="mx-auto my-12 flex h-[90%] w-full max-w-4xl">
      <Card className="w-full rounded-r-xl border bg-white shadow-none">
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription className="mb-4 mt-2">
            Invite your team members to collaborate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddTeamMembers organizationId={organization._id} />
          <Table className="mt-4">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

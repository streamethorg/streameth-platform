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
import DeleteTeamMember from './components/DeleteTeamMember';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import InviteCode from './components/InviteCode';

const Settings = async ({ params }: { params: studioPageParams['params'] }) => {
  const members = await fetchOrganizationMembers({
    organizationId: params.organization,
  });

  return (
    <>
      <div className="p-4 flex max-h-full w-full max-w-4xl">
        <Card className="w-full h-full rounded-r-xl border bg-white shadow-none md:p-0 flex flex-col">
          <CardHeader>
            <div className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Team members</CardTitle>
                <CardDescription className="mt-2">
                  Invite your team members to collaborate.
                </CardDescription>
              </div>
              <InviteCode />
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-6 lg:p-6 flex-1 overflow-auto">
            <div className="mt-6 h-full overflow-auto">
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
                        <DeleteTeamMember memberEmail={email as string} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Settings;

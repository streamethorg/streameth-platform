import React from 'react'
import { studioPageParams } from '@/lib/types'
import { fetchOrganization } from '@/lib/services/organizationService'
import {
  Card,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { fetchOrganizationMembers } from '@/lib/services/organizationService'
import AddTeamMembers from './components/AddTeamMembers'
import DeleteTeamMember from './components/DeleteTeamMember'
import { truncateAddr } from '@/lib/utils/utils'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
const Settings = async ({
  params,
  searchParams,
}: {
  params: studioPageParams['params']
  searchParams: {
    settingsActiveTab?: string
  }
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return null

  const members = await fetchOrganizationMembers({
    organizationId: organization._id,
  })

  return (
    <div className="p-8 flex w-full -hfull">
      <Card className="w-full rounded-r-xl m-auto h-full bg-white shadow-none max-w-3xl border p-4 space-y-4">
        <CardTitle>Team members</CardTitle>
        <CardDescription className="mt-2 mb-4">
          Invite your team members to collaborate.
        </CardDescription>

        <AddTeamMembers organizationId={organization._id} />
        <Table className="mt-4">
          <TableHeader className="sticky top-0 z-50 bg-gray-100 border-separate">
            <TableRow className="hover:bg-whiterounded-t-xl border-b">
              <TableHead>Wallet</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map(({ _id, walletAddress,role  }) => (
              <TableRow key={_id}>
                <TableCell>{walletAddress}</TableCell>
                <TableCell>{role}</TableCell>

                <TableCell>
                  <DeleteTeamMember
                    memberWalletAddress={walletAddress as string}
                    organizationId={organization._id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default Settings

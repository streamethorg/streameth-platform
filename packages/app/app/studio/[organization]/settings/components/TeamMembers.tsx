import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import React, { Suspense } from 'react'
import AddTeamMembers from './AddTeamMembers'
import { IExtendedUser } from '@/lib/types'
import DeleteTeamMember from './DeleteTeamMember'
import { truncateAddr } from '@/lib/utils/utils'

const TeamMembers = ({
  members = [],
  organizationId,
}: {
  members: IExtendedUser[]
  organizationId: string
}) => {
  return (
    <div className="h-full">
      <CardTitle>Team members</CardTitle>
      <CardDescription className="mt-2 mb-4">
        Invite your team members to collaborate.
      </CardDescription>

      <AddTeamMembers organizationId={organizationId} />

      <Card className="mt-4 shadow-none">
        <div className="grid grid-cols-5 p-4 border-opacity-10">
          <p className="col-span-3">Email / Wallet Address</p>
          <p>Permission</p>
        </div>
        {members?.map(({ _id, walletAddress }) => (
          <div
            key={_id}
            className="grid grid-cols-5 gap-4 border-t p-4 border-opacity-10 items-center">
            <div className="col-span-3">
              {truncateAddr(walletAddress!)}
            </div>
            <Button variant="outline">Editor</Button>

            <DeleteTeamMember
              memberWalletAddress={walletAddress as string}
              organizationId={organizationId}
            />
          </div>
        ))}
      </Card>
    </div>
  )
}

export default TeamMembers

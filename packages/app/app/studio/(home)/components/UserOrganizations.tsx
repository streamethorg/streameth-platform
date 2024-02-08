'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { UserContext } from '@/lib/context/UserContext'

const UserOrganizations = () => {
  const { userOrganizations } = useContext(UserContext)
  return (
    <div className="grid grid-cols-3  gap-4">
      {userOrganizations?.map((organization) => (
        <Link
          key={organization._id}
          href={`/studio/${organization.slug}`}>
          <Card className="flex h-[200px] overflow-hidden flex-row-reverse">
            <CardHeader>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>
                {organization.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                alt="logo"
                src={organization.logo}
                height={1400}
                width={400}
              />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default UserOrganizations

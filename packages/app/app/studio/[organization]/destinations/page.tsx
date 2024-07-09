import React from 'react'
import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { fetchOrganization } from '@/lib/services/organizationService'
import Image from 'next/image'
import { SiX, SiYoutube } from 'react-icons/si'
import { LuRadio } from 'react-icons/lu'
import DeleteDestination from './components/DeleteDestination'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const Destinations = async ({
  params,
}: {
  params: { organization: string }
}) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  })

  if (!organization) return null

  const renderSocialTypeIcon = (type: string) => {
    const className = 'absolute right-0 bottom-0'
    switch (type) {
      case 'youtube':
        return <SiYoutube color="#FF0000" className={className} />
      case 'x':
        return <SiX className={className} />
      default:
        return <LuRadio color="#000" className={className} />
    }
  }

  return (
    <div className="mx-auto mt-12 flex h-[90%] w-full max-w-4xl">
      <Card className="w-full rounded-r-xl border bg-white shadow-none">
        <CardHeader>
          <CardTitle>Destinations</CardTitle>
          <CardDescription className="mt-2">
            Manage and add social destinations
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Link href="destinations/connect">
            <Button variant="primary">Add a destination</Button>
          </Link>
          <Table className="mt-4">
            <TableHeader className="sticky top-0 z-50 border-separate bg-gray-100">
              <TableRow className="hover:bg-whiterounded-t-xl border-b">
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organization?.socials?.map(
                ({ _id, name, type, thumbnail }) => (
                  <TableRow key={_id}>
                    <TableCell className="flex items-center gap-4">
                      <div className="relative">
                        <Image
                          className="rounded-full"
                          src={thumbnail!}
                          width={50}
                          height={50}
                          alt={type}
                        />
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
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default Destinations

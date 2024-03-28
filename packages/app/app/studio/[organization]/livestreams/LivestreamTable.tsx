import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { IStage } from '@/lib/types'
import { getDateAsString } from '@/lib/utils/time'
import { CircleEllipsis } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LivestreamTable = ({
  streams,
  organizationSlug,
}: {
  streams: IStage[]
  organizationSlug: string
}) => {
  return (
    <Table className="bg-white">
      <TableHeader className="sticky top-0 bg-white z-50">
        <TableRow className="hover:bg-white">
          <TableHead className="">Title</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>IPFS Hash</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto ">
        {streams?.map((stream) => (
          <TableRow className="" key={stream._id}>
            <TableCell className="font-medium">
              <Link
                key={stream._id}
                href={`/studio/${organizationSlug}/edit?streamId=${stream?._id}`}>
                <div className="flex flex-row w-full space-x-4">
                  <div className="w-[100px]">
                    <Image
                      className="rounded-md"
                      alt="logo"
                      src={stream?.thumbnail ?? ''}
                      width={100}
                      height={50}
                    />
                  </div>

                  <p>{stream?.name}</p>
                </div>
              </Link>
            </TableCell>
            <TableCell>
              {getDateAsString(stream?.createdAt)}
            </TableCell>
            <TableCell>{stream?.ipfshash}</TableCell>
            <TableCell className="flex flex-row space-x-4">
              <CircleEllipsis />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default LivestreamTable

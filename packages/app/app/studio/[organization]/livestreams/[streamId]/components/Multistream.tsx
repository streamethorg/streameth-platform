import React from 'react'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DeleteMultistream from './DeleteMultistream'
import { CreateMultistreamTarget } from '../../../event/[eventId]/components/stageSettings/multistream/CreateMultistreamTarget'
import { IExtendedStage } from '@/lib/types'

const Multistream = ({
  stream,
  organizationId,
}: {
  stream: IExtendedStage
  organizationId: string
}) => {
  if (!stream) return null
  const streamTargets = stream?.streamSettings?.targets || []

  return (
    <div className="w-full">
      {streamTargets?.length === 0 ? (
        <Card className="shadow-none bg-white">
          <CardContent className="p-3 lg:p-6 flex justify-between items-center ">
            <CardTitle className="text-xl">
              Multistream Target
            </CardTitle>

            <CreateMultistreamTarget
              organizationId={organizationId}
              streamId={stream?.streamSettings?.streamId}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <CardContent className="!p-4 flex items-center justify-between ">
            <CardTitle className="text-2xl">
              Multistream Target
            </CardTitle>
            <CreateMultistreamTarget
              btnName="Add Target"
              organizationId={organizationId}
              streamId={stream?.streamSettings?.streamId}
            />
          </CardContent>
          <Card className="shadow-none bg-white">
            <Table>
              <TableHeader className="sticky top-0 z-50">
                <TableRow>
                  <TableHead className="">Name</TableHead>
                  <TableHead>Profile</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="overflow-scroll ">
                {streamTargets?.map((target) => (
                  <TableRow key={target.id} className="">
                    <>
                      <TableCell className="font-medium">
                        {target?.name}
                      </TableCell>
                      <TableCell className="font-medium">
                        source
                      </TableCell>

                      <TableCell className="font-medium flex justify-end">
                        <DeleteMultistream
                          streamId={stream?.streamSettings?.streamId}
                          organizationId={organizationId}
                          targetId={target.id}
                        />
                      </TableCell>
                    </>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Multistream

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
import { Stream } from 'livepeer/dist/models/components'
import { getMultistreamTarget } from '@/lib/actions/stages'
import DeleteMultistream from './DeleteMultistream'
import { CreateMultistreamTarget } from '../../../event/[eventId]/components/stageSettings/multistream/CreateMultistreamTarget'
import { IExtendedStage } from '@/lib/types'

const Multistream = ({ stream }: { stream: IExtendedStage }) => {
  if (!stream) return null
  const streamTargets = stream?.streamSettings?.targets || []

  return (
    <div>
      {streamTargets?.length === 0 ? (
        <Card>
          <CardContent className="flex justify-between items-center">
            <CardTitle className="text-xl">
              Multistream Target
            </CardTitle>

            <CreateMultistreamTarget
              streamId={stream?.streamSettings?.streamId}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <CardContent className="!p-4 flex items-center justify-between ">
            <CardTitle className="text-2xl">
              Multistream Target
            </CardTitle>
            <CreateMultistreamTarget
              btnName="Add Target"
              streamId={stream?.streamSettings?.streamId}
            />
          </CardContent>
          <Card>
            <Table>
              <TableHeader className="sticky top-0 z-50">
                <TableRow>
                  <TableHead className="">Name</TableHead>
                  <TableHead>Profile</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="overflow-scroll ">
                {streamTargets?.map((target) => (
                  <TableRow key={target.id} className="">
                    {target.id &&
                      getMultistreamTarget({
                        targetId: target.id,
                      }).then((data) => {
                        return (
                          <>
                            <TableCell className="font-medium">
                              {data?.name}
                            </TableCell>
                            <TableCell className="font-medium">
                              {target?.profile}
                            </TableCell>
                            <TableCell className="font-medium"></TableCell>
                            <TableCell className="font-medium flex justify-end">
                              <DeleteMultistream
                                streamId={
                                  stream?.streamSettings?.streamId
                                }
                                targetId={target.id}
                              />
                            </TableCell>
                          </>
                        )
                      })}
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

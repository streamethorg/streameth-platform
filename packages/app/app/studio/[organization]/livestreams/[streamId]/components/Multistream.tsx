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
import { CreateMultistreamTarget } from './StreamPlatforms/CreateMultistreamTarget'
import { IExtendedStage } from '@/lib/types'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { TargetOutput } from 'streameth-new-server/src/interfaces/stage.interface'

const MultiStreamActions = ({
  stream,
  organizationId,
  target,
}: {
  stream: IExtendedStage
  organizationId: string
  target: TargetOutput
}) => {
  const handleSwitch = () => { }

  return (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          onCheckedChange={() => handleSwitch()}
          id="stream_active"
        />
        <Label htmlFor="stream_active" />
      </div>
      <DeleteMultistream
        streamId={stream?.streamSettings?.streamId}
        organizationId={organizationId}
        targetId={target.id}
      />
    </>
  )
}

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
        <Card className="bg-white shadow-none">
          <CardContent className="flex flex-col justify-between items-center p-3 space-y-2 lg:p-6">
            <p className="text-muted-foreground">
              You have no destinations yet
            </p>
            <CreateMultistreamTarget
              btnName="Add First Channel"
              organizationId={organizationId}
              streamId={stream?.streamSettings?.streamId || ''}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <CardContent className="!p-0 flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Multistream Channels
            </CardTitle>
            <span className="text-muted-foreground">
              {streamTargets.length} active
            </span>
          </CardContent>
          <Card className="bg-white shadow-none">
            <Table>
              <TableHeader className="sticky top-0 z-50">
                <TableRow>
                  <TableHead className="min-w-[100px]">
                    Name
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="overflow-scroll">
                {streamTargets?.map((target) => (
                  <TableRow key={target.id}>
                    <>
                      <TableCell className="font-medium">
                        {target?.name}
                      </TableCell>

                      <TableCell className="flex justify-end space-x-2">
                        <MultiStreamActions
                          stream={stream}
                          organizationId={organizationId}
                          target={target}
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

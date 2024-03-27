'use client'
import { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { IStageModel } from 'streameth-new-server/src/interfaces/stage.interface'
import { deleteStageAction } from '@/lib/actions/stages'
import { IExtendedEvent } from '@/lib/types'
import { toast } from 'sonner'
import useSearchParams from '@/lib/hooks/useSearchParams'
import Link from 'next/link'

const StageAccordion = ({
  stages,
  event,
}: {
  stages: IStageModel[]
  event: IExtendedEvent
}) => {
  const { handleTermChange, searchParams } = useSearchParams()

  const stageSetting = searchParams.get('stageSetting')
  const selectedStage = searchParams.get('stage')
  const [value, setValue] = useState(stageSetting ?? '')
  const handleDeleteStage = async (
    stageId: string,
    organizationId: string,
    streamId: string
  ) => {
    if (
      window.confirm('Are you sure you want to delete this stage?')
    ) {
      await deleteStageAction({ stageId, organizationId, streamId })
        .then((response) => {
          if (response) {
            toast.success('Stage deleted')
          } else {
            toast.error('Error deleting stage')
          }
        })
        .catch(() => {
          toast.error('Error deleting stage')
        })
        .finally(() => {
          handleTermChange([
            {
              key: 'settings',
              value: 'event',
            },
          ])
        })
    }
  }
  return (
    <Accordion type="single" value={value} onValueChange={setValue}>
      {stages.map((stage) => {
        return (
          <AccordionItem
            className="px-2"
            key={stage._id}
            value={stage._id}>
            <AccordionTrigger
              onClick={() => {
                handleTermChange([
                  {
                    key: 'stage',
                    value: stage._id,
                  },
                  {
                    key: 'settings',
                    value: 'stage',
                  },
                ])
              }}>
              {stage.name}
            </AccordionTrigger>
            <AccordionContent
              onClick={() => {
                handleTermChange([
                  {
                    key: 'stage',
                    value: stage._id,
                  },
                  {
                    key: 'stageSetting',
                    value: 'settings',
                  },
                ])
              }}>
              <p className={`${'border-l border-primary'} px-2`}>
                Livestream settings
              </p>
            </AccordionContent>
            <Link href={`${event._id}/clips?stage=${stage._id}`}>
              <AccordionContent>
                <p
                  className={`${
                    stageSetting === 'clip' &&
                    'border-l border-primary'
                  } px-2`}>
                  Clips
                </p>
              </AccordionContent>
            </Link>
            <AccordionContent
              onClick={() => {
                handleDeleteStage(
                  stage._id,
                  event?.organizationId as string,
                  stage.streamSettings.streamId ?? ''
                )
              }}>
              <p className={`px-2`}>Delete</p>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}

export default StageAccordion

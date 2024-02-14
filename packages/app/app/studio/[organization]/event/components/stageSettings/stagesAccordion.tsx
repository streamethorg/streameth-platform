'use client'
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
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation'
import { useCallback } from 'react'

const StageAccordion = ({
  stages,
  event,
}: {
  stages: IStageModel[]
  event: IExtendedEvent
}) => {
  const searchParams = useSearchParams()

  const router = useRouter()
  const pathname = usePathname()
  const stageSetting = searchParams.get('stageSetting')
  const selectedStage = searchParams.get('selectedStage')
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

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
          router.refresh()
        })
    }
  }
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={selectedStage as string}
      onValueChange={() => {
        router.push(
          pathname +
            '?' +
            createQueryString('selectedSetting', 'stages')
        )

        // setSelectedSetting('stages')
      }}>
      {stages.map((stage) => {
        return (
          <AccordionItem
            className="px-2"
            key={stage._id}
            value={stage.name}
            onClick={() => {
              router.push(
                pathname +
                  '?' +
                  createQueryString('selectedStage', stage._id)
              )

              // setSelectedStage(stage._id)
            }}>
            <AccordionTrigger>{stage.name}</AccordionTrigger>
            <AccordionContent
              onClick={() => {
                router.push(
                  pathname +
                    '?' +
                    createQueryString('stageSetting', 'settings')
                )
                router.push(
                  pathname +
                    '?' +
                    createQueryString('selectedSetting', 'stages')
                )
              }}>
              <p
                className={`${
                  stageSetting === 'settings' &&
                  'border-l border-primary'
                } px-2`}>
                Livestream settings
              </p>
            </AccordionContent>
            <AccordionContent
              onClick={() => {
                router.push(
                  pathname +
                    '?' +
                    createQueryString('stageSetting', 'clip')
                )
                // setstageSetting('clip')
              }}>
              <p
                className={`${
                  stageSetting === 'clip' && 'border-l border-primary'
                } px-2`}>
                Clips
              </p>
            </AccordionContent>
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

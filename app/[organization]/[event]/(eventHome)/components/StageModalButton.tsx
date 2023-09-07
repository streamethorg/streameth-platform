"use client"
import StageModal from '@/app/[organization]/[event]/stage/[stage]/components/StageModal'
import { useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { useRouter } from 'next/navigation'
import { LoadingContext } from '@/components/context/LoadingContext'
import { IStage } from '@/server/model/stage'
import { ViewColumnsIcon } from '@heroicons/react/24/outline'


const StageModalButton = ({ stages }: { stages: IStage[] }) => {
  const { openModal, closeModal } = useContext(ModalContext)
  const { setIsLoading } = useContext(LoadingContext)
  const router = useRouter()

  const handleClick = (stageHref: string) => {
    setIsLoading(true)
    router.push(stageHref)
    closeModal()
  }

  return (
    <div className="flex flex-row justify-center">
      <button
        onClick={() =>
          openModal(
            <StageModal
              stages={stages.map((stage) => {
                return {
                  href: `${stage.eventId}/stage/${stage.id}`,
                  name: stage.name,
                  icon: <ViewColumnsIcon />,
                }
              })}
              handleClick={handleClick}
            />
          )
        }
        className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">
        Watch Livestream
      </button>
    </div>
  )
}

export default StageModalButton

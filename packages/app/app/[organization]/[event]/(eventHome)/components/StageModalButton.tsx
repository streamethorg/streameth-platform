'use client'
import StageModal from '@/app/[organization]/[event]/stage/[stage]/components/StageModal'
import { useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { useRouter } from 'next/navigation'
import { LoadingContext } from '@/components/context/LoadingContext'
import { ViewColumnsIcon } from '@heroicons/react/24/outline'
import { IStage } from 'streameth-server/model/stage'

const StageModalButton = ({ stages }: { stages: IStage[] }) => {
  const { openModal, closeModal } = useContext(ModalContext)
  const { setIsLoading } = useContext(LoadingContext)
  const router = useRouter()

  const handleClick = (stageHref: string) => {
    setIsLoading(true)
    router.push(stageHref)
    closeModal()
  }
  const stagePages = () => {
    let pages = []
    for (const stage of stages) {
      if (stage.streamSettings.streamId) {
        pages.push({
          href: `${stage.eventId}/stage/${stage.id}`,
          name: stage.name,
          icon: <ViewColumnsIcon />,
        })
      }
    }
    return pages
  }

  const handleButtonClick = () => {
    if (stages.length === 1) {
      const singleStage = stages[0]
      handleClick(`${singleStage.eventId}/stage/${singleStage.id}`)
    } else {
      openModal(
        <StageModal stages={stagePages()} handleClick={handleClick} />
      )
    }
  }

  return (
    <div className="flex flex-row justify-center">
      <button
        onClick={handleButtonClick}
        className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent rounded p-4 m-2">
        Watch Livestream
      </button>
    </div>
  )
}

export default StageModalButton

import StageModal from '@/app/[organization]/[event]/stage/[stage]/components/StageModal'
import {useContext } from 'react'
import { ModalContext } from '@/components/context/ModalContext'
import { useRouter } from 'next/navigation'
import { LoadingContext } from '@/components/context/LoadingContext'
import { Page } from '@/components/Layout/Navbar'
import {IStage} from '@/server/model/stage'

const StageModalButton = ({stages}: {
  stages: IStage[]
}) => {
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
    <button onClick={()=> openModal(<StageModal />)} className="hover:bg-accent font-bold hover:text-primary border-2 text-accent border-accent  rounded p-4 m-2">{children}</button>
</div>
)
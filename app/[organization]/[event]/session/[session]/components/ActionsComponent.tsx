'use client'
import { useContext } from 'react'
import { ISession } from '@/server/model/session'
import { ShareIcon, CodeBracketIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import EmbedSessionModal from '@/components/sessions/EmbedSession'
import { ModalContext } from '@/components/context/ModalContext'
import { useRouter } from 'next/navigation'

const ActionsComponent = ({ session, goBackButton = false, title = false }: { session: ISession; goBackButton?: boolean; title?: boolean }) => {
  const modal = useContext(ModalContext)
  const router = useRouter()
  const onBackClick = () => {
    router.back()
  }

  return (
    <div className="flex flex-row items-center md:w-full p-4 py-2 bg-base rounded-t shadow">
      {goBackButton && <ArrowUturnLeftIcon className="p-1 h-8 w-8 cursor-pointer " onClick={onBackClick} />}
      {title && <h1 className="text-main-text mr-2">{session.name}</h1>}
      <CodeBracketIcon
        className="p-1 cursor-pointer ml-auto h-8 w-8 text-accent font-medium"
        onClick={() => {
          modal.openModal(<EmbedSessionModal stageId={session.stageId} />)
        }}
      />
      <ShareIcon className="p-1 h-8 w-8 cursor-pointer ml-3 text-accent" />
    </div>
  )
}

export default ActionsComponent

'use client'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const ActionsComponent = ({ title, goBackButton = false, children }: { title?: string; goBackButton?: boolean; children: React.ReactNode }) => {
  const router = useRouter()

  const onBackClick = () => {
    router.back()
  }
  return (
    <div className="flex flex-row items-center md:w-full p-4 py-2 bg-base rounded-t shadow">
      {goBackButton && <ArrowUturnLeftIcon className="p-1 h-8 w-8 cursor-pointer " onClick={onBackClick} />}
      {title && <h1 className="text-xl text-accent font-bold p-2">{title}</h1>}
      {children}
    </div>
  )
}

export default ActionsComponent

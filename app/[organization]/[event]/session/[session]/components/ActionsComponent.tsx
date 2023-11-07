'use client'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

const ActionsComponent = ({
  title,
  goBackButton = false,
  children,
}: {
  title?: string
  goBackButton?: boolean
  children: React.ReactNode
}) => {
  const router = useRouter()

  const onBackClick = () => {
    router.back()
  }
  return (
    <div className="flex flex-row items-center bg-black rounded-t-xl md:w-full text-white p-2 ">
      {goBackButton && (
        <ArrowUturnLeftIcon
          className="p-1 h-8 w-8 cursor-pointer text-accent "
          onClick={onBackClick}
        />
      )}
      {title && (
        <h1 className="md:text-xl text-white uppercase ">{title}</h1>
      )}
      {children}
    </div>
  )
}

export default ActionsComponent

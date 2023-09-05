'use client'
import { useState, useContext } from 'react'
import { ShareIcon, CodeBracketIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { ModalContext } from '@/components/context/ModalContext'
import { useRouter } from 'next/navigation'

const ActionsComponent = ({ title, goBackButton = false, children }: { title?: string; goBackButton?: boolean; children: React.ReactNode }) => {
  const modal = useContext(ModalContext)
  const router = useRouter()
  const [copied, setCopied] = useState(false) // State for "Copied!" message visibility

  const onBackClick = () => {
    router.back()
  }

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href)

    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <div className="flex flex-row items-center md:w-full p-4 py-2 bg-base rounded-t shadow">
      {goBackButton && <ArrowUturnLeftIcon className="p-1 h-8 w-8 cursor-pointer " onClick={onBackClick} />}
      {title && <h1 className="text-main-text mr-2">{title}</h1>}
      {children}
      <ShareIcon className="p-1 h-8 w-8 cursor-pointer ml-3 text-accent" onClick={handleShareClick} />
      {copied && <span className="ml-3 text-accent transition-opacity duration-300">Copied!</span>}
    </div>
  )
}

export default ActionsComponent

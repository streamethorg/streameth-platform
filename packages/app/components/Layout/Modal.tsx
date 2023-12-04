'use client'
import { useEffect } from 'react'

const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) => {
  useEffect(() => {
    // return () => {
    //   if (open) {
    //     onClose()
    //   }
    // }
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.documentElement.style.overflow = 'unset'
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed z-[9999999999999999999] inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          onClick={onClose}>
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-accent rounded-xl   text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle min-w-lg max-w-full">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

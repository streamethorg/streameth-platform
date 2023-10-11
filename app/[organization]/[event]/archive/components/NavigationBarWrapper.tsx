'use client'

import { useState } from 'react'

const NavigationBarWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="hidden lg:flex">{children}</div>
      <div className="lg:hidden">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="m-4 text-lg bg-accent text-white p-2 rounded border-2 border-accent">
            Filter sessions
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="m-4 text-lg absolute top-0 right-0 bg-accent text-white p-2 rounded border-2 border-accent">
            close
          </button>
        )}
        {isOpen && children}
      </div>
    </>
  )
}

export default NavigationBarWrapper

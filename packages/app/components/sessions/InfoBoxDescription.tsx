'use client'

import { useState, useEffect, useRef } from 'react'
import MarkdownDisplay from '../misc/MarkdownDisplay'

const InfoBoxDescription = ({
  description,
}: {
  description?: string
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const [isExpandable, setIsExpandable] = useState(true)
  const descriptionRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (descriptionRef.current) {
        const isMobile = window.innerWidth <= 768 // Adjust mobile breakpoint as needed
        const descriptionHeight = description?.length || 0
        setIsExpandable(isMobile && descriptionHeight > 100)
      }
    }

    // Check on mount and window resize
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!description) return null

  return (
    <div className='py-4 relative'>
      <div
        ref={descriptionRef}
        className={`transition-max-height duration-700 ease-in-out overflow-hidden ${
          isExpandable && !isOpened && 'max-h-10 max-w-[90%] truncate'
        }`}>
        {description && <MarkdownDisplay content={description} />}
      </div>
      {isExpandable && (
        <button
          onClick={() => setIsOpened(!isOpened)}
          className="absolute right-0 bottom-0 pb-2 mr-5 ml-auto font-bold text-primary">
          {isOpened ? 'less' : 'more'}
        </button>
      )}
    </div>
  )
}

export default InfoBoxDescription

'use client'

import { useState, useEffect, useRef } from 'react'
import MarkdownDisplay from '../misc/MarkdownDisplay'
import { IExtendedSpeaker } from '@/lib/types'
import SpeakerIcon from '../speakers/speakerIcon'

const InfoBoxDescription = ({
  description,
  speakers,
}: {
  description?: string
  speakers?: IExtendedSpeaker[]
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const [isExpandable, setIsExpandable] = useState(true)
  const descriptionRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (descriptionRef.current) {
        const isMobile = window.innerWidth <= 768 // Adjust mobile breakpoint as needed
        const descriptionHeight = description?.length || 0
        setIsExpandable(descriptionHeight > 100)
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
    <div className="relative py-4">
      <div
        ref={descriptionRef}
        className={`transition-max-height duration-700 ease-in-out overflow-hidden ${
          isExpandable && !isOpened && 'max-h-10 max-w-[90%] truncate'
        }`}>
        {description && (
          <div className="space-y-2">
            <MarkdownDisplay content={description} />
            {speakers && (
              <div className="flex flex-col items-start space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                {speakers.map((speaker) => (
                  <SpeakerIcon key={speaker._id} speaker={speaker} />
                ))}
              </div>
            )}
          </div>
        )}
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

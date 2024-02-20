'use client'
import { useState, useEffect, useRef } from 'react'
import {
  Card,
  CardDescription,
  CardTitle,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from 'lucide-react'
import { ISpeaker } from 'streameth-new-server/src/interfaces/speaker.interface'
import SpeakerIcon from '../speakers/speakerIcon'

const InfoBoxDescription = ({
  description,
  speakers,
}: {
  speakers?: ISpeaker[]
  description?: string
}) => {
  const [isOpened, setIsOpened] = useState(false)
  const [isExpandable, setIsExpandable] = useState(false)
  const descriptionRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      if (descriptionRef.current) {
        const isMobile = window.innerWidth <= 768 // Adjust mobile breakpoint as needed
        const descriptionHeight = description?.length || 0
        setIsExpandable(isMobile && descriptionHeight < 100)
      }
    }

    // Check on mount and window resize
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <CardContent className="relative p-2 lg:p-2  border-t">
      <div
        ref={descriptionRef}
        className={`transition-max-height duration-700 ease-in-out overflow-hidden ${
          isExpandable && !isOpened && 'max-h-10'
        }`}>
        {description}
        <div className="flex flex-row mt-2 space-x-2 overflow-auto">
          {speakers &&
            speakers.map((speaker) => (
              <SpeakerIcon key={speaker._id} speaker={speaker} />
            ))}
        </div>
      </div>
      {isExpandable && (
        <button
          onClick={() => setIsOpened(!isOpened)}
          className="absolute ml-auto bottom-0 right-0 mr-2 text-primary">
          {isOpened ? <ArrowUpWideNarrow /> : <ArrowDownWideNarrow />}
        </button>
      )}
    </CardContent>
  )
}

export default InfoBoxDescription

'use client'
import React, { useEffect, useRef, useState } from 'react'

const ChannelDescription = ({
  description,
}: {
  description?: string
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isClamped, setClamped] = useState(false)
  const [isExpanded, setExpanded] = useState(false)

  useEffect(() => {
    function handleResize() {
      if (contentRef && contentRef.current) {
        setClamped(
          contentRef.current.scrollHeight >
            contentRef.current.clientHeight
        )
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [contentRef])

  return (
    <div className="hidden md:block w-4/5">
      <div
        ref={contentRef}
        className={!isExpanded ? 'line-clamp-2' : 'line-clamp-4'}>
        {' '}
        {description}
      </div>

      {isClamped && (
        <div className="flex justify-end cursor-pointer text-blue">
          <p
            className="font-semibold text-title"
            onClick={() => setExpanded(!isExpanded)}>
            {!isExpanded ? 'Read more' : ' Read less'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ChannelDescription

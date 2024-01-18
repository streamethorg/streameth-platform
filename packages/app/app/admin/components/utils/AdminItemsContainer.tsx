'use client'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

interface ItemsContainerProps {
  children: ReactNode
}

const AdminItemsContainer = ({ children }: ItemsContainerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [isScrolledToRight, setIsScrolledToRight] =
    useState<boolean>(false)

  useEffect(() => {
    const scrollRef = scrollContainerRef.current
    const handleScroll = () => {
      if (scrollRef) {
        const scrolledToRight =
          scrollRef.scrollLeft + scrollRef.offsetWidth <
          scrollRef.scrollWidth
        setIsScrolledToRight(scrolledToRight)
      }
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener(
        'scroll',
        handleScroll
      )
    }

    return () => {
      if (scrollRef) {
        scrollRef.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -100,
        behavior: 'smooth',
      })
    }
  }

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 100,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className=" min-h-[190px] p-4 drop-shadow-card border overflow-x-auto flex gap-5 ">
        {children}
      </div>
      {isScrolledToRight && (
        <div
          onClick={handleScrollLeft}
          className="absolute bg-gradient-to-l from-white cursor-pointer translate-y-[-50%] top-1/2 left-0 rotate-180 flex items-center justify-end w-[185px] h-[185px] p-2"></div>
      )}

      <div
        onClick={handleScrollRight}
        className="absolute bg-gradient-to-l from-white cursor-pointer translate-y-[-50%] top-1/2 right-0 w-[185px] h-[185px] flex items-center justify-end p-2"></div>
    </div>
  )
}

export default AdminItemsContainer

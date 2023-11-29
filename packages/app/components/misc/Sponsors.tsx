'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import ComponentCard from './ComponentCard'

type Sponsor = {
  name: string
  image: string
}

interface SponsorCarouselProps {
  sponsors: Sponsor[]
}

const SponsorCarousel: React.FC<SponsorCarouselProps> = ({
  sponsors: initialSponsors,
}) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors)
  const [translateX, setTranslateX] = useState<number>(0)

  useEffect(() => {
    const slideInterval = setInterval(() => {
      goToNextSlide()
    }, 8000)

    return () => {
      clearInterval(slideInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translateX])

  const goToNextSlide = () => {
    // Shift the sponsors array to create an infinite loop effect
    const newSponsors = [...sponsors]
    const first = newSponsors.shift()
    if (first) {
      newSponsors.push(first)
    }
    setSponsors(newSponsors)

    // Adjust the translation
    setTranslateX((prev) => prev - 100)
  }

  return (
    <ComponentCard title="Sponsors" collapasble streatch>
      <div className="relative h-20 lg:h-full overflow-hidden ">
        {sponsors.map((sponsor, index) => (
          <div
            key={sponsor.name} // Using name as key since the order will change
            style={{
              transform: `translateX(${-100 + index * 100}%)`,
              transition: 'transform 0.7s ease-in-out',
            }}
            className={`absolute top-0 w-1/4 h-full flex flex-col items-center justify-center`}>
            {/* <Image src={sponsor.image} layout='fill' objectFit="contain" alt={sponsor.name} /> */}
            <span className="mt-2">{sponsor.name}</span>
          </div>
        ))}
      </div>
    </ComponentCard>
  )
}

export default SponsorCarousel

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Talks = [
  {
    name: 'ZuConnect Istanbul Opening Remarks',
    date: 'ZuConnect 2023',
    speakers: '',
    link: 'zuzalu/zuconnect_istanbul/session/opening_remarks',
    image: '/events/zuzalu-cover.png',
  },
  {
    name: 'Why neurotech is maybe the only thing that matters',
    date: 'ZuConnect 2023',
    speakers: 'Juan Benet, Mike Johnson, Milan Cvitkovic',
    link: '/zuzalu/zuconnect_istanbul__neurotech_track/session/why_neurotech_is_maybe_the_only_thing_that_matters',
    image: '/events/zuzalu-cover.png',
  },
  {
    name: 'Walkthrough of the frontier of neurotech',
    date: 'ZuConnect 2023',
    speakers: 'Milan Cvitkovic',
    link: 'zuzalu/zuconnect_istanbul__neurotech_track/session/walkthrough_of_the_frontier_of_neurotech_technologies_companies_scientific_breakthroughs',
    image: '/events/zuzalu-cover.png',
  },
  //   {
  //     name: 'ZuConnect - Decentralized Social Track',
  //     date: 'ZuConnect 2023',
  //     speakers: '',
  //     link: '/zuzalu/zuconnect__decentralized_social_track',
  //     image: '/events/zuzalu-cover.png',
  //   },
]

const HotTalks = () => {
  return (
    <>
      <h3 className="font-ubuntu font-bold text-lg px-4 text-blue">
        Hot Talks
      </h3>
      <div className="h-full p-4 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll">
        {Talks.map(({ name, date, link, image, speakers }, index) => (
          <Link
            href={link}
            key={index}
            className="cursor-pointer px-2 hover:shadow-md rounded-xl">
            <div className="h-full rounded-xl text-white uppercase">
              <div className="aspect-video relative">
                <Image
                  className="rounded"
                  alt="Session image"
                  quality={80}
                  src={`${image}`}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                />
              </div>
              <div
                className="flex flex-col gap-1 my-2"
                title="Zuzalu">
                <p className=" text-sm font-bold capitalize text-blue ">
                  {name}
                </p>
                <p className="text-blue text-sm capitalize truncate">
                  {speakers}
                </p>
                <p className="text-blue text-sm font-medium capitalize">
                  {date}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}

export default HotTalks

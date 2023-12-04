import Card from '@/components/misc/Card'
import { getImageUrl } from '@/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Talks = [
  {
    name: 'Panel on new governance x Zuzalu’s future',
    date: 'ZuConnect 2023',
    speakers: 'Vitalik Buterin, Janine, Mark Lutter',
    link: 'zuzalu/zuconnect_istanbul__new_governance/session/panel_on_new_governance_x_zuzalus_future',
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
  {
    name: 'The role of crypto infrastructures in the next civilizational transition',
    date: 'ZuConnect 2023',
    speakers: 'Michel Bauwens',
    link: 'zuzalu/zuconnect_istanbul__new_governance/session/the_role_of_crypto_infrastructures_in_the_next_civilizational_transition',
    image: '/events/zuzalu-cover.png',
  },
]

const HotTalks = () => {
  return (
    <>
      <h3 className="font-ubuntu font-bold text-lg px-4 text-blue">
        Hot Talks
      </h3>
      <div className="h-full p-4 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4 md:overflow-scroll">
        {Talks.map(({ name, date, link, image, speakers }, index) => (
          <Card key={index}>
            <Link href={link} key={index}>
              <div className="h-full rounded-xl text-white uppercase">
                <div className="aspect-video relative">
                  <Image
                    className="rounded"
                    alt="Session image"
                    quality={80}
                    src={getImageUrl(image)}
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
          </Card>
        ))}
      </div>
    </>
  )
}

export default HotTalks

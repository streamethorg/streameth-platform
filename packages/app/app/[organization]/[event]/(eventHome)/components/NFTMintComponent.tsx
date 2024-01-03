'use client'
import Image from 'next/image'
import MintButton from '@/components/misc/MintButton'
import nft from '@/public/swarmNFT.jpeg'
import ComponentWrapper from './ComponentWrapper'
import SectionTitle from './SectionTitle'
import { usePathname } from 'next/navigation'

const NFTMintComponent = () => {
  const pathname = usePathname()

  return pathname.includes('swarm') ? (
    <ComponentWrapper sectionId="nft">
      <div className="flex flex-col md:flex-row justify-center">
        <div className="w-full md:w-[60%] p-2">
          <SectionTitle title="SWARM 2.0 LIVESTREAM NFT" />
          <p className="text-xl">
            Embrace the Swarm! In conjunction with the Swarm 2.0
            launch, we&apos;re introducing the Swarm 2.0 Livestream
            NFT—a unique digital experience powered by the innovation
            of Swarm.
            <br />
            <br />
            Mint the Swarm 2.0 Livestream NFT and join us in
            celebrating the dawn of a new era in the digital realm.
            <br />
          </p>
        </div>
        <div className="flex flex-col w-full md:w-[40%] p-2 bg-base shadow rounded-lg justify-center items-center">
          <Image alt="nft image" src={nft}></Image>
          <MintButton address="0xcA41A03CD3017aA4B19530816261A989593312a4" />
        </div>
      </div>
    </ComponentWrapper>
  ) : null
}

export default NFTMintComponent

import Image from 'next/image'
import MintButton from '@/components/misc/MintButton'
import nft from '@/public/Base-house.jpg'
import ComponentWrapper from './ComponentWrapper'
import SectionTitle from './SectionTitle'

const NFTMintComponent = () => {
  return (
    <ComponentWrapper sectionId="nft">
      <div className="flex flex-col md:flex-row justify-center">
        <div className="w-full md:w-[60%] p-2">
          <SectionTitle title="Mint the NFT" />
          <p className="text-xl">
            Mint this exclusive livestream NFT - for the first time
            ever, users can now watch livestreams directly from their
            NFT. <br />
            <br />
            To try it out, simply mint this nft for free and go to any
            supported marketplace to watch the livestream once we go
            live!
          </p>
        </div>
        <div className="w-full md:w-[40%] p-2 bg-base shadow rounded-lg">
          <Image alt="nft image" src={nft}></Image>
          <MintButton address="0xD628D7cE49f0796D3e23C5dD1e1C20eDAA224132" />
        </div>
      </div>
    </ComponentWrapper>
  )
}

export default NFTMintComponent

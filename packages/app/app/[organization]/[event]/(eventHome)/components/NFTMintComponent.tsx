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
            Base is celebrating creativity and onchain art at Art
            Basel with the first ever livestream video NFT, built on
            Base by Streameth and powered by Livepeer. By minting the
            Base Miami Broadcast NFT, you can experience Base House
            and tune in to the programming LIVE from any NFT
            marketplace. Listen to artist, creators, and founders who
            are redefining art and music onchain, and explore Base’s
            vision for the new open internet.
            <br />
            <br />
            With the Base Miami Broadcast NFT, you will also be
            eligible for commemorative drops after the event.
          </p>
        </div>
        <div className="flex flex-col w-full md:w-[40%] p-2 bg-base shadow rounded-lg justify-center items-center">
          <Image alt="nft image" src={nft}></Image>
          <MintButton address="0xD628D7cE49f0796D3e23C5dD1e1C20eDAA224132" />
        </div>
      </div>
    </ComponentWrapper>
  )
}

export default NFTMintComponent

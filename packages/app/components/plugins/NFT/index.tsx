import Image from 'next/image'
import MintButton from '@/components/misc/MintButton'
import nft from '@/public/Base-house.jpg'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
const NFTMintComponent = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="w-full p-2">
        <p className=" text-white">
          By minting the Base Miami Broadcast NFT, you can experience
          Base House and tune in to the programming LIVE from any NFT
          marketplace.
          <br />
          <br />
          With the Base Miami Broadcast NFT, you will also be eligible
          for commemorative drops after the event.
        </p>
      </div>
      <div className="flex flex-col w-full  p-2 shadow rounded-lg justify-center items-center">
        <Image alt="nft image" src={nft}></Image>
        <div className="flex flex-row">
          <MintButton address="0x3afa8ecae2503f6a892d40b9a0d905ece7a7219b" />
          <Button>
            <Link
              href="https://opensea.io/assets/base/0x3afa8ecae2503f6a892d40b9a0d905ece7a7219b/1"
              target="blank"
              rel="noreferrer">
              Watch on Opensea
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NFTMintComponent

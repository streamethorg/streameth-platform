'use client'
import Image from 'next/image'
import MintButton from '@/components/misc/MintButton'
import nft from '@/public/swarmNFT.jpeg'
import ComponentWrapper from './ComponentWrapper'
import SectionTitle from './SectionTitle'
import { Button } from '@/components/Form/Button'
import { usePathname } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { ConnectKitButton } from 'connectkit'

const NFTMintComponent = () => {
  const pathname = usePathname()
  const [whitelistAddress, setWhitelistAddress] =
    useState<[{ address: string }]>()
  const [isLoadingWhitelist, setIsLoadingWhitelist] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState<
    boolean | undefined
  >(false)
  const { address, isConnected } = useAccount()

  function isAddressFound(targetAddress: `0x${string}` | undefined) {
    if (!isLoadingWhitelist && whitelistAddress && targetAddress) {
      return whitelistAddress.some(
        (entry) =>
          entry.address.toLowerCase() === targetAddress.toLowerCase()
      )
    }
  }
  const whitelist = async () => {
    setIsLoadingWhitelist(false)
    fetch('https://streameth-dev.up.railway.app')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to get whitelist addresses')
        }
        return response.json()
      })
      .then((responseData) => {
        setWhitelistAddress(responseData.data)
      })
      .catch((err) => {
        console.error('An error occurred', err)
      })
  }
  useEffect(() => {
    whitelist()
  }, [])

  useEffect(() => {
    if (whitelistAddress) {
      const alreadyMinted = isAddressFound(address)
      setIsWhitelisted(alreadyMinted)
    }
  }, [whitelistAddress, address])

  const addWhitelistAddress = async () => {
    if (!isAddressFound(address)) {
      const data = { address: address }
      fetch('https://streameth-dev.up.railway.app/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create data on the server')
          }
          return response.json()
        })
        .then((responseData) => {
          setIsWhitelisted(true)
          alert('Addresses added successfully')
          console.log(responseData)
        })
        .catch((error) => {
          console.error('An error occurred:', error)
        })
    }
  }

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

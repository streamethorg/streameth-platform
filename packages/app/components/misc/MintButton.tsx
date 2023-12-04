'use client'
import { useState } from 'react'
import {
  useContractRead,
  useContractWrite,
  useAccount,
  Address,
} from 'wagmi'
import { ethers } from 'ethers'
import CastrABI from '@/contracts/Castr-abi'
import { Button } from '@/components/Form/Button'

const MintButton = ({ address }: { address: string }) => {
  const [mintLoading, setMintLoading] = useState(false)
  const { address: userAddress, isConnected } = useAccount()
  // const { data } = useContractRead({
  //   address: address as Address,
  //   abi: CastrABI,
  //   functionName: "mintPrice",
  //   args: [],
  // });

  const { writeAsync: mint, error: mintError } = useContractWrite({
    address: address as Address,
    abi: CastrABI,
    functionName: 'subscribe',
    args: [userAddress],
  })

  const onMintClick = async () => {
    if (!isConnected) alert('Please connect your wallet')
    try {
      const tx = await mint()
    } catch (error) {
      console.error(error)
    } finally {
      setMintLoading(false)
    }
  }

  return (
    <Button
      variant={'default'}
      onClick={onMintClick}
      isLoading={mintLoading}>
      <span className="md:hidden">SUBSCRIBE</span>
      <span className="hidden md:block">collect this livestream</span>
    </Button>
  )
}

export default MintButton

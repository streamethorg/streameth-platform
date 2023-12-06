'use client'
import { useContext, useEffect, useState } from 'react'
import {
  useContractRead,
  useContractWrite,
  useAccount,
  Address,
  useWaitForTransaction,
  useSwitchNetwork,
  useNetwork,
} from 'wagmi'
import CastrABI from '@/contracts/Castr-abi'
import { Button } from '@/components/Form/Button'
import { ConnectKitButton } from 'connectkit'
import { ModalContext } from '@/context/ModalContext'
import { base } from 'viem/chains'
import Image from 'next/image'
import Link from 'next/link'

export const MintSuccess = ({ hash }: { hash: string }) => {
  return (
    <div className="p-10 w-[400px] md:w-[600px] flex flex-col items-center justify-center">
      <Image
        width={150}
        height={150}
        src="/success.png"
        alt="success"
      />
      <h3 className="text-3xl mt-2 font-bold">Mint Successful</h3>
      <Link
        href={`https://basescan.org/tx/${hash}`}
        target="_blank"
        rel="noopener"
        className="pt-4 text-left whitespace-nowrap underline text-blue">
        View Tx on Base Scan
      </Link>
    </div>
  )
}

const MintButton = ({ address }: { address: string }) => {
  const { address: userAddress, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { openModal } = useContext(ModalContext)

  const {
    data: transaction,
    writeAsync: mint,
    error: mintError,
  } = useContractWrite({
    address: address as Address,
    abi: CastrABI,
    functionName: 'subscribe',
    args: [userAddress],
  })

  const { data, isLoading } = useWaitForTransaction({
    hash: transaction?.hash,
  })

  useEffect(() => {
    if (mintError) {
      openModal(
        <div className="p-10 w-[400px] md:w-[600px] text-center">
          {mintError.message}
        </div>
      )
    }
    if (data) {
      openModal(<MintSuccess hash={data?.transactionHash} />)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, mintError])
  const onSwitchNetwork = () => {
    switchNetwork?.(base.id)
  }

  return chain?.id !== base.id || !isConnected ? (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <Button
            onClick={
              !isConnected
                ? show
                : chain?.id !== base?.id
                ? onSwitchNetwork
                : show
            }
            className="hover:text-base uppercase text-xl hover:text-xl p-2">
            {!isConnected
              ? 'Login to collect'
              : chain?.id !== base?.id && 'Click and switch to Base'}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  ) : (
    <div className="flex flex-row justify-center">
      <Button
        variant={'default'}
        onClick={() => mint()}
        isLoading={isLoading}
        className="hover:text-base uppercase text-xl hover:text-xl p-2 border">
        Click to collect
      </Button>
    </div>
  )
}

export default MintButton

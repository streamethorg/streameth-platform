import { use, useEffect, useState } from "react"
import { SiweMessage } from "siwe"
import { useSignMessage } from "wagmi"

export const useDm3Siwe = (address: string) => {
    const { signMessageAsync } = useSignMessage()
    const [siweSig, setSiweSig] = useState<string>()
    const [siweMessage, setSiweMessage] = useState<SiweMessage>()

    useEffect(() => {
        const siwe = getSiweFromLocalStorage()
        if (siwe) {
            setSiweSig(siwe.siweSig)
            setSiweMessage(new SiweMessage(siwe.siweMessage))
        }
    }, [address])

    const SIWE_KEY = 'DM3-SIWE'
    const signInWithEthereum = async () => {
        const siwe = new SiweMessage({
            domain: window.location.host,
            address: address,
            statement: 'Sign in with Ethereum to use dm3.',
            uri: window.location.origin,
            version: '1',
            chainId: 1,
            nonce: '0x123456789',
            expirationTime: new Date(100000000000000).toISOString(),
        })
        const siweMessage = siwe.prepareMessage()
        const sig = await signMessageAsync({
            message: siweMessage,
        })

        setSiweSig(sig)
        setSiweMessage(siwe)
        storeSiweInLocalStorage({
            address: address!,
            sig,
            siweMessage,
        })
    }
    const storeSiweInLocalStorage = (
        {
            address,
            sig,
            siweMessage,
        }: {
            address: string
            sig: string
            siweMessage: string
        },

    ) => {
        localStorage.setItem(
            SIWE_KEY,
            JSON.stringify({
                siweAddress: address,
                siweSig: sig,
                siweMessage: siweMessage,
            })
        )
    }

    const getSiweFromLocalStorage = () => {
        const siwe = localStorage.getItem(SIWE_KEY)

        if (siwe) {
            return JSON.parse(siwe)
        }
        return null
    }

    return { signInWithEthereum, getSiweFromLocalStorage, siweMessage, siweSig }
}


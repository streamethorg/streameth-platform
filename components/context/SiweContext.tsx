import { SiweMessage } from 'siwe'
import { ConnectKitProvider, SIWEConfig, SIWEProvider, getDefaultConfig } from 'connectkit'
import { PropsWithChildren } from 'react'
import { WagmiConfig, createConfig } from 'wagmi'

const authApi = '/api/auth'
const siweConfig = {
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      nonce,
      chainId,
      address,
      version: '1',
      uri: window.location.origin,
      domain: window.location.host,
      statement: 'Sign In With Ethereum to prove you control this wallet.',
    }).prepareMessage()
  },
  verifyMessage: async ({ message, signature }) => {
    const res = await fetch(authApi, {
      method: 'POST',
      body: JSON.stringify({ message, signature }),
      headers: { 'Content-Type': 'application/json' },
    })
    return res.ok
  },
  getSession: async () => {
    const res = await fetch(authApi)
    if (!res.ok) throw new Error('Failed to fetch SIWE session')

    const { address, chainId } = await res.json()
    return address && chainId ? { address, chainId } : null
  },
  getNonce: async () => {
    const res = await fetch(authApi, { method: 'PUT' })
    if (!res.ok) throw new Error('Failed to fetch SIWE nonce')

    return res.text()
  },
  signOut: async () => {
    const res = await fetch(authApi, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to sign out')

    return res.ok
  },
} satisfies SIWEConfig

const config = createConfig(
  getDefaultConfig({
    appName: 'StreamETH',
    infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  })
)

const SiweContext = (props: PropsWithChildren) => {
  return (
    <WagmiConfig config={config}>
      <SIWEProvider {...siweConfig}>
        <ConnectKitProvider>{props.children}</ConnectKitProvider>
      </SIWEProvider>
    </WagmiConfig>
  )
}

export default SiweContext

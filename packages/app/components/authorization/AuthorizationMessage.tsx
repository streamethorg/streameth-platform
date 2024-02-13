import React from 'react'
import { ConnectWalletButton } from '../misc/ConnectWalletButton'

const AuthorizationMessage = () => {
  return (
    <div className="flex flex-col items-center h-screen justify-center">
      <h3>
        You do not have access to this page, Sign in to continue
      </h3>
      <ConnectWalletButton />
    </div>
  )
}

export default AuthorizationMessage

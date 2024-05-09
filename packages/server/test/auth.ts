import { ethers } from 'ethers';
import {config} from '@config'
const { SiweMessage, generateNonce } = require('siwe');
const wallet = ethers.Wallet.createRandom();
const walletAddress = wallet.address;

export const generateWalletInfo = async () => {
    const nonce = generateNonce()
    const message = new SiweMessage({
      nonce: nonce,
      chainId: 1,
      address: walletAddress,
      version: '1',
      domain: config.testUrl,
      uri: config.testUrl,
      statement: 'Sign in with Ethereum to the app.',
    });
    const signature = await wallet.signMessage(message.prepareMessage());
    return {
      nonce: nonce,
      signature: signature,
      message: message.prepareMessage(),
      walletAddress: walletAddress
    };
  };
import { staticFile } from 'remotion'

export { Intro } from './intro'
export { Join } from './join'
export { Social } from './social'

export const DevconnectFrameRate = 25
export const DevconnectIntroDuration = 10 * DevconnectFrameRate
export const DevconnectOutroDuration = 9 * DevconnectFrameRate

export const DevconnectISTFont = new FontFace(
  `Grotesk Compact Smooth`,
  `url('${staticFile(
    '0xparc/fonts/FKRasterGroteskCompact-Smooth.ttf'
  )}') format('truetype')`
)

// 1 = blue/teal
// 2 = teal/orange
// 3 = yellow/orange
// 4 = red
// 5 = pink/purple
// 6 = purple
// 7 = blue
export const DevconnectEvents = [
  { id: 'epf-day', type: '5' },
  { id: 'ethconomics', type: '4' },
  { id: 'ethgunu', type: '7' },
  { id: 'evm-summit', type: '3' },
  { id: 'solidity-summit', type: '6' },
  { id: 'light-client-summit', type: '1' },
  { id: 'fe-lang-hackathon', type: '1' },
  { id: 'conflux--web3-ux-unconference', type: '7' },
  { id: 'wallet-unconference', type: '2' },
  // { id: 'cryptographic-resilience-within-ethereum', type: '4' },
]

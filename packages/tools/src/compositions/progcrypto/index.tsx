import { staticFile } from 'remotion'

export { Intro } from './intro'
export { Join } from './join'
export { Social } from './social'

export const DevconnectFrameRate = 25
export const DevconnectIntroDuration = 215
export const DevconnectOutroDuration = 9 * DevconnectFrameRate

export const ProgCryptoFont_Med = new FontFace(
  `Grotesk Trial Medium`,
  `url('${staticFile(
    '0xparc/fonts/FKGroteskTrial-Medium.otf'
  )}') format('opentype')`
)

export const ProgCryptoFont_Reg = new FontFace(
  `Grotesk Trial Regular`,
  `url('${staticFile(
    '0xparc/fonts/FKGroteskTrial-Regular.otf'
  )}') format('opentype')`
)

// 1 = blue/teal
// 2 = teal/orange
// 3 = yellow/orange
// 4 = red
// 5 = pink/purple
// 6 = purple
// 7 = blue
export const DevconnectEvents = [
  { id: 'progcrypto', type: '5' },
]

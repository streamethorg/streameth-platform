import { loadFont } from '@remotion/google-fonts/Vollkorn'
import { staticFile } from 'remotion'

// Global
export const G_EVENT = 'FtC'
export const G_DURATION = 170
export const G_LOGO_PICTURE = '/images/FtC.svg'
export const G_FPS = 25
export const G_VIDEO_PATH = '/videos/stream.mp4'
export const G_ANIMATION_PATH = '/animations/FtC_animation.mp4'
export const G_AUDIO_PATH = '/audio/522_short1_cream-soda-day_0018.wav'
export const G_DEFAULT_AVATAR_URL = staticFile('/images/ETHLogo.jpg')
export const G_SCALE_IMAGE = 2

/// / Please check Google Font what weights you can use
export const { fontFamily } = loadFont()

/// / Use the following if you have a none-Google Font
// const waitForFont = delayRender();
// const font = new FontFace(
//     `Latin Modern`,
//     `url('${staticFile('font/lmsans10-bold.otf')}') format('otf')`,
// );
//
// font.load()
//     .then(() => {
//         document.fonts.add(font);
//         continueRender(waitForFont);
//     })
//     .catch((err) => {
//         console.log('Error loading font', err);
//         continueRender(waitForFont);
//     });

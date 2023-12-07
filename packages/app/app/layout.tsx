import './globals.css'
import { Ubuntu, Heebo } from 'next/font/google'
import GeneralContext from '@/context/GeneralContext'
import { ModalContextProvider } from '@/context/ModalContext'
import { MobileContextProvider } from '@/context/MobileContext'
import { LoadingContextProvider } from '@/context/LoadingContext'
import { TopNavbarContextProvider } from '@/context/TopNavbarContext'
import Initializer from './Initializer'
import { Metadata } from 'next'
import { FilterContextProvider } from '../context/FilterContext'

// export const metadata: Metadata = {
//   title: 'StreamETH',
//   description:
//     'The complete solution to host your hybrid or virtual event.',
//   metadataBase: new URL('https://app.streameth.org'),
//   openGraph: {
//     title: 'StreamETH',
//     siteName: 'StreamETH',
//     description:
//       'The complete solution to host your hybrid or virtual event.',
//     images: {
//       url: 'https://app.streameth.org/banner.png',
//       alt: 'StreamETH Logo',
//     },
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'StreamETH',
//     description:
//       'The complete solution to host your hybrid or virtual event.',
//     images: {
//       url: 'https://app.streameth.org/banner.png',
//       alt: 'StreamETH Logo',
//     },
//   },
//   alternates: {
//     canonical: '/',
//     languages: {
//       'en-US': '/en-US',
//     },
//   },
// }

const ubuntu = Ubuntu({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu',
})

const heebo = Heebo({
  subsets: ['latin'],
  variable: '--font-heebo',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${ubuntu.variable} font-ubuntu`}>
      <body
        className={`${heebo.variable} font-sans flex flex-col w-screen min-h-screen bg-accent`}>
        <GeneralContext>
          <LoadingContextProvider>
            <MobileContextProvider>
              <ModalContextProvider>
                <FilterContextProvider>
                  <TopNavbarContextProvider>
                    <Initializer>{children}</Initializer>
                  </TopNavbarContextProvider>
                </FilterContextProvider>
              </ModalContextProvider>
            </MobileContextProvider>
          </LoadingContextProvider>
        </GeneralContext>
      </body>
    </html>
  )
}

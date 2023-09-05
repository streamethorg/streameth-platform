import './globals.css'
import { Quicksand } from 'next/font/google'
import GeneralContext from '@/components/context/GeneralContext'
import { ModalContextProvider } from '@/components/context/ModalContext'
import { MobileContextProvider } from '@/components/context/MobileContext'
import Navbar from '@/components/Layout/NavbarTop'
import { LoadingContext, LoadingContextProvider } from '@/components/context/LoadingContext'
import { Metadata } from 'next'

const quicksand = Quicksand({
  subsets: ['latin', 'latin-ext'],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${quicksand.className}`}>
        <GeneralContext>
          <LoadingContextProvider>
            <MobileContextProvider>
              <ModalContextProvider>
                <div className="bg-background flex flex-col h-[100dvh] lg:overflow-hidden w-screen">
                  <Navbar />
                  {children}
                </div>
              </ModalContextProvider>
            </MobileContextProvider>
          </LoadingContextProvider>
        </GeneralContext>
      </body>
    </html>
  )
}


export const metadata: Metadata = {
  metadataBase: new URL('https://app.streameth.org'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
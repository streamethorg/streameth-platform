import './globals.css'
import { Ubuntu, Heebo } from 'next/font/google'
import GeneralContext from '@/components/context/GeneralContext'
import { ModalContextProvider } from '@/components/context/ModalContext'
import { MobileContextProvider } from '@/components/context/MobileContext'
import { LoadingContextProvider } from '@/components/context/LoadingContext'
import { TopNavbarContextProvider } from '@/components/context/TopNavbarContext'
import { FilterContextProvider } from '../components/context/FilterContext'
import { Metadata } from 'next'
import Initializer from './Initializer'

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
      <body className={`${heebo.variable} font-sans`}>
        <GeneralContext>
          <LoadingContextProvider>
            <MobileContextProvider>
              <ModalContextProvider>
                <div className=" flex flex-col w-screen min-h-screen bg-accent">
                  <FilterContextProvider>
                    <TopNavbarContextProvider>
                      <Initializer>{children}</Initializer>
                    </TopNavbarContextProvider>
                  </FilterContextProvider>
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
  title: 'StreamETH',
  description:
    'The complete solution to host your hybrid or virtual event.',
  metadataBase: new URL('https://app.streameth.org'),
  openGraph: {
    title: 'StreamETH',
    siteName: 'StreamETH',
    description:
      'The complete solution to host your hybrid or virtual event.',
    images: {
      url: 'https://streameth.org/lib_wsURRdlMczHRgWBe/n7lvh3tpq34a2b6c.png?w=180&h=50&dpr=2',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StreamETH',
    description:
      'The complete solution to host your hybrid or virtual event.',
    images: {
      url: 'https://streameth.org/lib_wsURRdlMczHRgWBe/n7lvh3tpq34a2b6c.png?w=180&h=50&dpr=2',
      alt: 'StreamETH Logo',
    },
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
}

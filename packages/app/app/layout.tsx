import './globals.css'
import { Ubuntu, Heebo } from 'next/font/google'
import GeneralContext from '@/lib/context/GeneralContext'
import { ModalContextProvider } from '@/lib/context/ModalContext'
import { MobileContextProvider } from '@/lib/context/MobileContext'
import { LoadingContextProvider } from '@/lib/context/LoadingContext'
import { TopNavbarContextProvider } from '@/lib/context/TopNavbarContext'
import { generalMetadata } from '@/lib/utils/metadata'
import { Toaster } from '@/components/ui/sonner'

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
        className={`${heebo.variable} font-sans flex flex-col w-full min-h-screen  mx-auto bg-background `}>
        <GeneralContext>
          <Toaster />
          <LoadingContextProvider>
            <MobileContextProvider>
              <ModalContextProvider>
                <TopNavbarContextProvider>
                  {children}
                </TopNavbarContextProvider>
              </ModalContextProvider>
            </MobileContextProvider>
          </LoadingContextProvider>
        </GeneralContext>
      </body>
    </html>
  )
}

export const metadata = generalMetadata

import './globals.css'
import { Quicksand } from 'next/font/google'
import { Metadata } from 'next'
import GeneralContext from '@/components/context/GeneralContext'
import { ModalContextProvider } from '@/components/context/ModalContext'
import { MobileContextProvider } from '@/components/context/MobileContext'
import Navbar from '@/components/Layout/NavbarTop'
import { LoadingContext, LoadingContextProvider } from '@/components/context/LoadingContext'

const quicksand = Quicksand({
  subsets: ['latin', 'latin-ext'],
})

export const metadata: Metadata = {
  title: 'streamETH',
  description: 'The complete solution to organize your virtual or hybrid event',
}

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

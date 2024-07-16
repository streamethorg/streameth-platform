import './globals.css';
import { Inter } from 'next/font/google';
import GeneralContext from '@/lib/context/GeneralContext';
import { MobileContextProvider } from '@/lib/context/MobileContext';
import { LoadingContextProvider } from '@/lib/context/LoadingContext';
import { TopNavbarContextProvider } from '@/lib/context/TopNavbarContext';
import { generalMetadata } from '@/lib/utils/metadata';
import { Toaster } from '@/components/ui/sonner';
import CookieBanner from '@/components/misc/interact/CookieBanner';
import { TooltipProvider } from '@/components/ui/tooltip';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="">
        <main
          className={`${inter.variable} bg-background mx-auto flex min-h-screen w-full flex-col`}
        >
          <TooltipProvider>
            <GeneralContext>
              <Toaster />
              <LoadingContextProvider>
                <MobileContextProvider>
                  <TopNavbarContextProvider>
                    {children}
                    <div className="fixed bottom-4 left-4 z-50 mr-4">
                      <CookieBanner />
                    </div>
                  </TopNavbarContextProvider>
                </MobileContextProvider>
              </LoadingContextProvider>
            </GeneralContext>
          </TooltipProvider>
        </main>
      </body>
    </html>
  );
}

export const metadata = generalMetadata;

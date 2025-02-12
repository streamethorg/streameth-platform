import './globals.css';
import { Inter } from 'next/font/google';
import GeneralContext from '@/lib/context/GeneralContext';
import { MobileContextProvider } from '@/lib/context/MobileContext';
import { LoadingContextProvider } from '@/lib/context/LoadingContext';
import { TopNavbarContextProvider } from '@/lib/context/TopNavbarContext';
import { generalMetadata } from '@/lib/utils/metadata';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { fetchUserAction } from '@/lib/actions/users';
import { UserContextProvider } from '@/lib/context/UserContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    organization: string;
  };
}) {
  // const user = await fetchUserAction();

  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="">
        <main
          className={`${inter.variable} mx-auto flex min-h-screen w-full flex-col bg-background`}
        >
          <UserContextProvider user={{}}>
            <TooltipProvider>
              <GeneralContext>
                <Toaster />
                <LoadingContextProvider>
                  <MobileContextProvider>
                    <TopNavbarContextProvider>
                      {children}
                    </TopNavbarContextProvider>
                  </MobileContextProvider>
                </LoadingContextProvider>
              </GeneralContext>
            </TooltipProvider>
          </UserContextProvider>
        </main>
      </body>
    </html>
  );
}

export const metadata = generalMetadata;

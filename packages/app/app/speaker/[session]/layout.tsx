'use server';

import HomePageNavbar from '@/components/Layout/HomePageNavbar';
import Footer from '@/components/Layout/Footer';
import { Page } from '@/lib/types';

const Layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col mx-auto w-full bg-white min-h-[100vh]">
      <HomePageNavbar showLogo={true} pages={[]} showSearchBar={false} />
      <div className="flex-grow w-full h-full">{children}</div>
      <div className="sticky mb-5 top-[100vh]">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;

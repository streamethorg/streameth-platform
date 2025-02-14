import React from 'react';
import NavbarStudio from '@/components/Layout/NavbarStudio';

const Layout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-screen w-screen flex-col">
      <NavbarStudio showSearchBar={false} />
      <div className=" flex-row top-[72px] flex h-[calc(100vh-72px)]">
        <div className="w-full max-w-[calc(100%)] h-full  flex-col overflow-hidden border-t ">
          <div className="flex h-full w-full flex-row ">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

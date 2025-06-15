import React from "react";
import NavbarStudio from "@/components/Layout/NavbarStudio";
import SidebarMenu from "@/components/Sidebar/SidebarMenu";

const Layout = async ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<div className="flex flex-col w-screen h-screen">
			<NavbarStudio showSearchBar={false} />
			<div className="flex flex-row top-[72px] h-[calc(100vh-72px)]">
				<SidebarMenu />
				<div className="w-full max-w-[calc(100%-73px)] h-full  flex-col overflow-hidden border-t ">
					<div className="flex flex-row w-full h-full">{children}</div>
				</div>
			</div>
		</div>
	);
};

export default Layout;

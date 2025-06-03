"use server";

import HomePageNavbar from "@/components/Layout/HomePageNavbar";
import Footer from "@/components/Layout/Footer";
import { fetchOrganization } from "@/lib/services/organizationService";
import { fetchStages } from "@/lib/services/stageService";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { OrganizationContextProvider } from "@/lib/context/OrganizationContext";

const Layout = async ({
	params,
	children,
}: {
	params: { organization: string };
	children: React.ReactNode;
}) => {
	const org = params.organization;
	const pages = [
		{
			name: "Home",
			href: `/${org}`,
			bgColor: "bg-muted",
		},
		{
			name: "Videos",
			href: `/${org}/videos`,
			bgColor: "bg-muted",
		},
	];

	const organization = await fetchOrganization({
		organizationId: params.organization,
	});

	if (params.organization === organization?.slug) {
		redirect(`/${organization?._id}`);
	}

	if (!organization) {
		return notFound();
	}

	const stages = await fetchStages({
		organizationId: params.organization,
	});

	const stagesStatus = {
		currentStages: stages.length || 0,
		paidStages: Infinity,
		isOverLimit: false,
	};

	return (
		<OrganizationContextProvider
			organization={organization}
			daysLeft={0}
			canUseFeatures={false}
			canCreateStages={false}
			subscriptionStatus={{
				isActive: false,
				daysLeft: 0,
				hasExpired: false,
				isProcessing: false,
				isPending: false,
				isFailed: false,
				hasAvailableStages: false,
			}}
			stagesStatus={stagesStatus}
		>
			<div className="flex flex-col mx-auto w-full bg-white min-h-[100vh]">
				<HomePageNavbar
					logo={organization?.logo}
					currentOrganization={organization._id}
					pages={pages}
					showSearchBar
					showLogo={true}
				/>
				<div className="flex-grow w-full h-full">{children}</div>
				<div className="sticky mb-5 top-[100vh]">
					<Footer />
				</div>
			</div>
		</OrganizationContextProvider>
	);
};

export default Layout;

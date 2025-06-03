import Support from "@/components/misc/Support";
import { fetchOrganization } from "@/lib/services/organizationService";
import { redirect } from "next/navigation";
import { IExtendedOrganization, StudioPageParams } from "@/lib/types";
import {
	OrganizationContextProvider,
	SubscriptionStatus,
} from "@/lib/context/OrganizationContext";
import { fetchStages } from "@/lib/services/stageService";
import { fetchUser } from "@/lib/services/userService";
import { canUseFeature } from "@/lib/utils/subscription";

const calculateOrganizationStatus = (
	organization: IExtendedOrganization,
): SubscriptionStatus => {
	let daysLeft = 0;
	let hasExpired = true;

	if (organization.subscriptionPeriodEnd) {
		const expiryDate = new Date(organization.subscriptionPeriodEnd);
		const now = new Date();
		daysLeft = Math.ceil(
			(expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24),
		);
		hasExpired = daysLeft <= 0;
	}

	const isSubscriptionActive = organization.subscriptionStatus === "active";
	const isFree = organization.subscriptionTier === "free";
	// Free tier never expires
	if (isFree) {
		hasExpired = false;
	}

	return {
		isActive: isSubscriptionActive || isFree,
		isProcessing: organization.subscriptionStatus === "past_due",
		isPending: organization.subscriptionStatus === "trialing",
		isFailed:
			organization.subscriptionStatus === "unpaid" ||
			organization.subscriptionStatus === "canceled",
		daysLeft,
		hasExpired,
		hasAvailableStages: true, // Always true since we no longer limit stages
	};
};

const Layout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: StudioPageParams["params"];
}) => {
	const { organization } = await params;
	const currentOrganization = await fetchOrganization({
		organizationId: organization,
	});

	const user = await fetchUser();
	if (!user) {
		redirect("/studio");
	}

	if (!currentOrganization) {
		redirect("/studio");
	}
	const isOwner = user.organizations.includes(currentOrganization._id);

	if (!isOwner) {
		redirect("/studio");
	}

	const stages = await fetchStages({
		organizationId: organization,
	});

	if (!currentOrganization) {
		redirect("/studio");
	}

	const status = calculateOrganizationStatus(currentOrganization);

	// Allow features based on subscription status:
	// 1. Free tier always has access to its basic features
	// 2. Paid tiers have access during active, canceling, or trial periods
	const canUseFeatures =
		currentOrganization.subscriptionTier === "free" ||
		currentOrganization.subscriptionStatus === "active" ||
		currentOrganization.subscriptionStatus === "canceling" ||
		currentOrganization.subscriptionStatus === "trialing";

	// Check if they can create stages based on tier and subscription status
	const canCreateStages = canUseFeature(
		currentOrganization,
		"isLivestreamingEnabled",
	);

	// We're keeping the stagesStatus structure but removing limits
	const stagesStatus = {
		currentStages: stages.length || 0,
		paidStages: Infinity, // Unlimited stages now
		isOverLimit: false, // Never over limit
	};

	return (
		<OrganizationContextProvider
			organization={currentOrganization}
			daysLeft={status.daysLeft}
			canUseFeatures={canUseFeatures}
			canCreateStages={canCreateStages}
			subscriptionStatus={status}
			stagesStatus={stagesStatus}
		>
			{children}
			<Support />
		</OrganizationContextProvider>
	);
};

export default Layout;

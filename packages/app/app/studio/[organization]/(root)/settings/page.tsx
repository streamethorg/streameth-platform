"use client";

import React from "react";
import CreateOrganizationForm from "@/app/studio/(home)/components/CreateOrganizationForm";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useOrganizationContext } from "@/lib/context/OrganizationContext";

const Settings = () => {
	const { organization } = useOrganizationContext();
	return (
		<div className="flex my-12 mx-auto w-full max-w-4xl">
			<Card className="w-full h-full bg-white rounded-r-xl border shadow-none">
				<CardHeader>
					<CardTitle>Edit yout channel</CardTitle>
					<CardDescription>
						Header logo and description will appear on your channel page
					</CardDescription>
				</CardHeader>
				<CardContent>
					<CreateOrganizationForm
						disableName={true}
						organization={organization}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default Settings;

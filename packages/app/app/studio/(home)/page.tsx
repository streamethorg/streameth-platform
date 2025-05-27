"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import JoinOrganizationForm from "./components/JoinOrganizationForm";
import CreateOrganizationForm from "./components/CreateOrganizationForm";
import { useUserContext } from "@/lib/context/UserContext";
import { Loader2 } from "lucide-react";

const Studio = () => {
	const { user, isLoading } = useUserContext();
	const organizations = user?.organizations || null;

	// Add a timeout to prevent getting stuck in the loading state forever
	const [showTimeout, setShowTimeout] = useState(false);

	useEffect(() => {
		// If loading takes more than 3 seconds, provide a way to refresh
		const timeoutId = setTimeout(() => {
			if (isLoading) {
				setShowTimeout(true);
			}
		}, 3000);

		return () => clearTimeout(timeoutId);
	}, [isLoading]);

	// Show loading state while data is being fetched
	if (isLoading) {
		return (
			<div className="flex flex-col justify-center items-center space-y-4 h-[calc(100vh-200px)]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
				{showTimeout && (
					<div className="text-center">
						<p className="mb-2 text-sm text-muted-foreground">
							Loading is taking longer than expected
						</p>
						<button
							onClick={() => window.location.reload()}
							className="text-sm hover:underline text-primary"
						>
							Refresh the page
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex overflow-auto flex-col flex-grow p-2 m-auto w-full max-w-4xl h-full bg-background">
				{organizations && organizations.length > 0 ? (
					<>
						<div className="flex flex-row justify-between items-center py-2 w-full">
							<CardTitle>Your organizations</CardTitle>
							<Link href="/studio/create">
								<Button className="w-full">Create Organization</Button>
							</Link>
						</div>
						<div className="flex overflow-auto flex-col space-y-2 h-full">
							{organizations?.map((organization) => (
								<Link
									key={organization._id}
									href={`/studio/${organization._id}`}
								>
									<Card className="flex overflow-hidden flex-row h-full rounded-xl border shadow-none border-secondary">
										<CardHeader className="relative p-3 lg:p-3">
											<Image
												className="h-full rounded-full"
												alt="logo"
												src={organization.logo}
												width={45}
												height={30}
											/>
										</CardHeader>
										<CardContent className="flex flex-col justify-center p-3 space-y-2 w-full h-full lg:p-3">
											<p className="text-xl">{organization.name}</p>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</>
				) : (
					<div className="flex flex-col mx-auto mt-12 space-y-8 w-full max-w-4xl">
						<div className="flex flex-row">
							<div className="p-6 space-y-4 w-1/3 rounded-l-xl bg-neutrals-100">
								<Image
									src="/logo.png"
									alt="streameth logo"
									height={50}
									width={50}
								/>
								<h1 className="text-2xl font-medium">Create an organization</h1>
								<p className="text-sm text-muted-foreground">
									Organizations are used to manage events and videos. You can
									create multiple organizations to manage different types of
									events.
								</p>
							</div>
							<Card className="m-auto w-2/3 bg-white rounded-r-xl border-none shadow-none">
								<CardContent>
									<CreateOrganizationForm />
								</CardContent>
							</Card>
						</div>

						<div className="flex flex-row">
							<div className="p-6 space-y-4 w-1/3 rounded-l-xl bg-neutrals-100">
								<h1 className="text-2xl font-medium">Join an organization</h1>
								<p className="text-sm text-muted-foreground">
									Have an invitation code? Join an existing organization to
									collaborate with others.
								</p>
							</div>
							<Card className="m-auto w-2/3 bg-white rounded-r-xl border-none shadow-none">
								<CardContent>
									<JoinOrganizationForm />
								</CardContent>
							</Card>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Studio;

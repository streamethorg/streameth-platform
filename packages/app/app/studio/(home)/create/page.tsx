"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateOrganizationForm from "../components/CreateOrganizationForm";
import JoinOrganizationForm from "../components/JoinOrganizationForm";
import Image from "next/image";
import { useState } from "react";

const CreateOrganization = () => {
	const [step, setStep] = useState(1);
	const [action, setAction] = useState<"create" | "join" | null>(null);

	const renderStep1 = () => (
		<Card className="flex flex-col">
			<CardHeader>
				<Image
					src="/logo_dark.png"
					alt="streameth logo"
					height={250}
					width={200}
					priority
				/>
			</CardHeader>
			<CardContent className="flex flex-row space-x-8">
				<div
					className="p-4 w-1/2 rounded-xl border shadow-sm transition-all cursor-pointer hover:shadow-md border-border hover:bg-muted hover:scale-[1.02] hover:border-primary/50"
					onClick={() => {
						setAction("create");
						setStep(2);
					}}
				>
					<h1 className="text-2xl font-medium">Create an organization</h1>
					<p className="text-sm text-muted-foreground">
						Organizations are used to manage events and videos. You can create
						multiple organizations to manage different types of events.
					</p>
				</div>

				<div
					className="p-4 w-1/2 rounded-xl border shadow-sm transition-all cursor-pointer hover:shadow-md border-border hover:bg-muted hover:scale-[1.02] hover:border-primary/50"
					onClick={() => {
						setAction("join");
						setStep(2);
					}}
				>
					<h1 className="text-2xl font-medium">Join an organization</h1>
					<p className="text-sm text-muted-foreground">
						Have an invitation code? Join an existing organization to
						collaborate with others.
					</p>
				</div>
			</CardContent>
		</Card>
	);

	const renderStep2 = () => (
		<Card className="w-full">
			<CardContent className="p-6">
				{action === "create" ? (
					<CreateOrganizationForm />
				) : (
					<JoinOrganizationForm />
				)}
			</CardContent>
		</Card>
	);

	return (
		<div className="flex flex-col mx-auto mt-12 space-y-8 w-full max-w-4xl">
			{step === 1 ? renderStep1() : renderStep2()}
		</div>
	);
};

export default CreateOrganization;

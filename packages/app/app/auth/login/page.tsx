"use client";

import {
	Card,
	CardHeader,
	CardDescription,
	CardTitle,
	CardContent,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import LoginBackground from "@/public/login-background.png";
import SignInWithSocials from "./components/SignInWithSocials";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const LoginFormAndContent = () => {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");
	const callbackUrl = searchParams.get("callbackUrl") || "/studio";
	const isOAuthError = searchParams.get("error") === "OAuthCallbackError";

	return (
		<div className="flex flex-row w-screen h-screen">
			<div className="flex flex-col justify-center items-center w-full h-full md:w-1/2">
				<Card className="shadow-none max-w-[480px]">
					<CardHeader className="text-center">
						<CardTitle>Welcome to StreamETH</CardTitle>
						<CardDescription>Sign in to connect to StreamETH</CardDescription>
						<div className="flex flex-col gap-4 divide-y">
							<div className="flex flex-col justify-center items-center w-full pt-[20px]">
								{error && (
									<div className="pb-4 text-sm text-destructive">
										{isOAuthError
											? "Error logging in, please try again"
											: error}
									</div>
								)}
								<SignInWithSocials callbackUrl={callbackUrl} />
							</div>
						</div>
					</CardHeader>

					<CardContent>
						<p className="mt-2 text-sm text-muted-foreground">
							By signing up you agree to the{" "}
							<Link className="underline" href="/terms">
								Terms of Service
							</Link>{" "}
							and{" "}
							<Link className="underline" href="/privacy">
								Privacy Policy
							</Link>
							.
						</p>
					</CardContent>
				</Card>
			</div>
			<div className="hidden relative w-1/2 h-full md:block bg-primary">
				<Image
					quality={100}
					alt="login background"
					src={LoginBackground}
					layout="fill"
					objectFit="cover"
				/>
			</div>
		</div>
	);
};

const LoginPageLoadingFallback = () => {
	return (
		<div className="flex justify-center items-center w-screen h-screen">
			<p>Loading Login Page...</p>
		</div>
	);
};

const LoginPage = () => {
	return (
		<Suspense fallback={<LoginPageLoadingFallback />}>
			<LoginFormAndContent />
		</Suspense>
	);
};

export default LoginPage;

"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

const Loading = () => (
	<div className="flex flex-col justify-center items-center h-screen">
		<h2 className="text-2xl font-bold text-gray-600">Verifying...</h2>
	</div>
);

const InitialParamsLoading = () => (
	<div className="flex flex-col justify-center items-center h-screen">
		<h2 className="text-2xl font-bold text-gray-600">Loading...</h2>
	</div>
);

const MagicLinkHandler = () => {
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const email = searchParams.get("email");
	const redirect = searchParams.get("redirect");

	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const authenticate = async () => {
			if (!token || !email) {
				router.push(
					"/auth/login?error=Error: check your email for the correct magic link or try again",
				);
				setLoading(false);
				return;
			}

			const result = await signIn("credentials", {
				token: token,
				email: email,
				type: "email",
				redirect: false,
			});

			if (result?.error) {
				setError("Error: Failed to sign in.");
				router.push("/auth/login?error=Login failed or token expired");
			} else {
				router.push(redirect || "/studio");
			}
			setLoading(false);
		};

		authenticate();
	}, [token, router]);

	if (loading) {
		return <Loading />;
	}

	if (error) {
		return (
			<div className="flex flex-col justify-center items-center h-screen">
				<h2 className="text-2xl font-bold text-red-600">{error}</h2>
				<p className="mt-2 text-gray-600">Please try again later.</p>
			</div>
		);
	}

	return null;
};

const MagicLinkPage = () => {
	return (
		<Suspense fallback={<InitialParamsLoading />}>
			<MagicLinkHandler />
		</Suspense>
	);
};

export default MagicLinkPage;

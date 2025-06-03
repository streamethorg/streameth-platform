"use client";

import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { constructYoutubeLiveRedirect } from "@/lib/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

/* searchParams: { authUser: string }; */

const GoogleRedirectContent = () => {
	const searchParams = useSearchParams();
	const authUser = searchParams.get("authUser") || "";

	return (
		<div className="container p-12 mx-auto space-y-2 max-w-5xl text-black">
			<h3 className="text-3xl font-bold">Enable live streaming on YouTube</h3>
			<p>
				To stream and repurpose content to YouTube, YouTube requires you to
				enable live streaming on your channel. To do this, follow these steps:{" "}
			</p>
			<p>1. Go to your YouTube live dashboard</p>
			<Link href={constructYoutubeLiveRedirect(authUser)}>
				<Button className="my-4">Open Youtube Live Dashboard</Button>
			</Link>
			<p>2. Follow YouTube&apos;s steps to enable live streaming.</p>
			<Image
				src="/images/youtube-tutorial.png"
				alt="YouTube Streaming Guide"
				className="py-4"
				width={1280}
				height={720}
			/>
			<p>
				3. Once live streaming is enabled, return to StreamEth and connect
				again. It often takes 24-48 hours to be approved.
			</p>

			<p className="mt-24">
				Having issues?{" "}
				<a
					target="_blank"
					className="font-medium underline text-primary"
					rel="noopener noopener"
					href="https://t.me/+p7TgdE06G-4zZDU0"
				>
					Contact Us
				</a>
			</p>
			<div className="mt-48">
				<Footer />
			</div>
		</div>
	);
};

const GoogleRedirectLoadingFallback = () => {
	return (
		<div className="container flex justify-center items-center p-12 mx-auto h-screen">
			<p className="text-xl">Loading instructions...</p>
		</div>
	);
};

const GoogleRedirect = () => {
	return (
		<Suspense fallback={<GoogleRedirectLoadingFallback />}>
			<GoogleRedirectContent />
		</Suspense>
	);
};

export default GoogleRedirect;

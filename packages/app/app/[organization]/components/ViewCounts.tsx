"use client";

import { fetchSessionMetrics } from "@/lib/services/sessionService";
import { useEffect, useState } from "react";

const ViewCounts = ({
	playbackId,
	className,
}: {
	playbackId: string;
	className?: string;
}) => {
	const [viewCount, setViewCount] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			const data = await fetchSessionMetrics({ playbackId });
			setViewCount(data.viewCount);
			setIsLoading(false);
		};

		fetchData();
	}, [playbackId]);

	if (isLoading) {
		return (
			<p className={className ?? "text-secondary py-2 text-sm"}>
				<span className="inline-block w-12 h-3 rounded animate-pulse bg-slate-200"></span>
			</p>
		);
	}

	return (
		<p className={className ?? "text-secodary py-2 text-sm"}>
			{viewCount} views
		</p>
	);
};

export default ViewCounts;

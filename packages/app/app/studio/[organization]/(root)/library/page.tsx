"use server";

import { redirect } from "next/navigation";
import { Suspense } from "react";
import { eLayout, eSort } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VideosTab from "./components/tabs/VideosTab";
import PlaylistsTab from "./components/tabs/PlaylistsTab";
import { TableSkeleton } from "./components/Library";
import { PlaylistTableSkeleton } from "./components/PlaylistTable";

interface LibraryProps {
	params: Promise<{ organization: string }>;
	searchParams: Promise<{
		layout: eLayout;
		sort: eSort;
		show: boolean;
		tab?: string;
	}>;
}

const LibraryPage = async ({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: LibraryProps) => {
	const params = await paramsPromise;
	const searchParams = await searchParamsPromise;

	if (
		!searchParams.layout ||
		(searchParams.layout !== eLayout.grid &&
			searchParams.layout !== eLayout.list)
	) {
		redirect(
			`/studio/${params.organization}/library?layout=${eLayout.list}&page=1&limit=20`,
		);
	}

	return (
		<div className="flex overflow-hidden relative flex-col px-4 mt-2 w-full h-full">
			<Tabs
				defaultValue={searchParams.tab || "videos"}
				className="flex flex-col h-full"
			>
				<TabsList className="flex-shrink-0 justify-start mb-4">
					<TabsTrigger value="videos">
						<p className="text-lg font-bold">Videos</p>
					</TabsTrigger>
					<TabsTrigger value="playlists">
						<p className="text-lg font-bold">Playlists</p>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="videos" className="pb-6 w-full h-full min-h-0">
					<Suspense fallback={<TableSkeleton />}>
						<VideosTab params={params} searchParams={searchParams} />
					</Suspense>
				</TabsContent>
				<TabsContent value="playlists" className="pb-6 w-full h-full min-h-0">
					<Suspense fallback={<PlaylistTableSkeleton />}>
						<PlaylistsTab organizationId={params.organization} />
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default LibraryPage;

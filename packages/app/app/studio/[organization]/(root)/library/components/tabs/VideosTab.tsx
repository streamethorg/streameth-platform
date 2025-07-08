"use server";

import { Suspense } from "react";
import { eSort } from "@/lib/types";
import Library, { TableSkeleton } from "../Library";
import LibraryFilter from "../LibraryFilter";
import { fetchOrganizationStages } from "@/lib/services/stageService";

interface VideosTabProps {
	params: { organization: string };
	searchParams: { sort: eSort; show: boolean };
}

const VideosTab = async ({ params, searchParams }: VideosTabProps) => {
	const stages = await fetchOrganizationStages({
		organizationId: params.organization,
	});

	return (
		<div className="flex relative flex-col w-full h-full">
			<div className="flex">
				<div>
					<LibraryFilter stages={stages} />
				</div>
				{/* Pagination will be rendered by Library in absolute position */}
			</div>
			<div className="flex-1 min-h-0">
				<Suspense
					fallback={<TableSkeleton />}
					key={JSON.stringify(searchParams)}
				>
					<Library params={params} searchParams={searchParams} />
				</Suspense>
			</div>
		</div>
	);
};

export default VideosTab;


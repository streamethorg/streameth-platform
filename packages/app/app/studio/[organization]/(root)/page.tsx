import TableSkeleton from "@/components/misc/Table/TableSkeleton";
import { LivestreamPageParams } from "@/lib/types";
import CreateLivestreamModal from "./livestreams/components/CreateLivestreamModal";
import { Suspense } from "react";
import LivestreamTable from "./livestreams/components/LivestreamTable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ClipContentButton from "./library/components/ClipContentButton";
import UploadVideoDialog from "./library/components/UploadVideoDialog";

export default async function OrganizationPage({
	params: paramsPromise,
	searchParams: searchParamsPromise,
}: LivestreamPageParams) {
	const params = await paramsPromise;
	const searchParams = await searchParamsPromise;

	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);

	return (
		<div className="flex overflow-auto flex-col p-4 w-full h-full">
			<div className="flex flex-col p-2 w-full">
				<h2 className="text-lg font-bold">Create</h2>
				<div className="flex gap-4 items-center p-4">
					<CreateLivestreamModal variant="primary" show={searchParams?.show} />
					<UploadVideoDialog variant="outlinePrimary" />
					<ClipContentButton variant="outlinePrimary" />
				</div>
			</div>

			<Tabs defaultValue="current">
				<TabsList>
					<TabsTrigger value="current">
						<p className="text-lg font-bold">Active livestreams</p>
					</TabsTrigger>
					<TabsTrigger value="past">
						<p className="text-lg font-bold">Past livestreams</p>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="current" className="p-4">
					<LivestreamTable
						fromDate={startOfDay.getTime().toString()}
						organizationId={params?.organization}
					/>
				</TabsContent>
				<TabsContent value="past" className="p-4">
					<Suspense
						key={searchParams.toString()}
						fallback={
							<div className="flex flex-col h-full bg-white">
								<TableSkeleton />
							</div>
						}
					>
						<LivestreamTable
							untilDate={startOfDay.getTime().toString()}
							organizationId={params?.organization}
						/>
					</Suspense>
				</TabsContent>
			</Tabs>
		</div>
	);
}

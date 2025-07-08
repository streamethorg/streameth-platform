"use server";

import { fetchAllSessions } from "@/lib/services/sessionService";
import { Suspense } from "react";
import EmptyLibrary from "./EmptyLibrary";
import { IExtendedSession, eLayout, eSort } from "@/lib/types";

import { sortArray } from "@/lib/utils/utils";
import Pagination from "./Pagination";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "@/components/ui/table";
import TableCells from "./TableCells";
import TableSort from "@/components/misc/TableSort";

const Library = async ({
	params,
	searchParams,
}: {
	params: { organization: string };
	searchParams: {
		layout: eLayout;
		sort: eSort;
		show?: boolean;
		limit?: number;
		page?: number;
		searchQuery?: string;
		stage?: string;
		type?: string;
		published?: string;
		itemStatus?: string;
		itemDate?: string;
		clipable?: boolean;
	};
}) => {
	let sessions = await fetchAllSessions({
		organizationId: params.organization,
		limit: searchParams.limit || 20,
		page: searchParams.page || 1,
		searchQuery: searchParams.searchQuery,
		stageId: searchParams.stage,
		published: searchParams.published,
		type: searchParams.type,
		itemStatus: searchParams.itemStatus,
		itemDate: searchParams.itemDate,
		clipable: searchParams.clipable,
	});

	// We do not need to refilter sessions since we are fetching onlyVideos
	const sortedSessions = sortArray(
		sessions.sessions,
		searchParams.sort,
	) as unknown as IExtendedSession[];

	return (
		<>
			{!sortedSessions || sortedSessions.length === 0 ? (
				<div className="bg-white rounded-xl mx-0 my-2 border h-[calc(100%-90px)]">
					<EmptyLibrary />
				</div>
			) : (
				<div className="flex flex-col h-full">
					<div className="flex overflow-hidden flex-col my-2 mx-0 h-full bg-white rounded-xl border">
						<div className="overflow-auto flex-1 min-h-0">
							<Table className="bg-white">
								<TableHeader className="sticky top-0 z-10 bg-white rounded-t-xl">
									<TableRow className="rounded-t-xl hover:bg-white">
										<TableHead className="cursor-pointer">
											<TableSort title="Title" sortBy="name" />
										</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Duration</TableHead>
										<TableHead className="cursor-pointer">
											<TableSort title="Created at" sortBy="date" />
										</TableHead>
										<TableHead>Views</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sessions.sessions.map((item) => (
										<TableRow key={item._id}>
											<Suspense
												fallback={<TableCellsSkeleton />}
												key={JSON.stringify(searchParams)}
											>
												<TableCells item={item} />
											</Suspense>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</div>
					<div className="absolute right-0 top-[-32px]">
						<Pagination {...sessions.pagination} />
					</div>
				</div>
			)}
		</>
	);
};

export default Library;

const TableCellsSkeleton = () => {
	return (
		<>
			<TableCell className="relative p-2 h-20 font-medium animate-pulse md:p-2 w-[597px]">
				<div className="flex flex-row items-center space-x-4 w-full">
					<div className="w-24 h-12 bg-gray-200 animate-pulse min-w-[100px]" />
					<div className="flex flex-col space-y-2 w-full">
						<div className="w-32 h-4 bg-gray-200 animate-pulse" />
						<div className="w-32 h-4 bg-gray-200 animate-pulse" />
					</div>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex items-center space-x-1">
					<div className="w-4 h-4 bg-gray-200 animate-pulse" />
					<div className="w-16 h-4 bg-gray-200 animate-pulse" />
				</div>
			</TableCell>
			<TableCell>
				<div className="w-16 h-4 bg-gray-200 animate-pulse" />
			</TableCell>
			<TableCell>
				<div className="w-32 h-4 bg-gray-200 animate-pulse" />
			</TableCell>
			<TableCell>
				<div className="w-32 h-4 bg-gray-200 animate-pulse" />
			</TableCell>
			<TableCell>
				<div className="flex items-center space-x-1">
					<div className="w-4 h-4 bg-gray-200 animate-pulse" />
					<div className="w-16 h-4 bg-gray-200 animate-pulse" />
				</div>
			</TableCell>
			<TableCell>
				<div className="flex justify-end items-center space-x-2 max-w-[100px]">
					<div className="w-8 h-8 bg-gray-200 animate-pulse" />
					<div className="w-8 h-8 bg-gray-200 animate-pulse" />
					<div className="w-8 h-8 bg-gray-200 animate-pulse" />
				</div>
			</TableCell>
		</>
	);
};

export const TableSkeleton = async () => {
	return (
		<div className="flex overflow-hidden relative flex-col h-full">
			<div className="flex overflow-hidden flex-col my-2 mx-0 h-full bg-white rounded-xl border">
				<div className="overflow-auto flex-1 min-h-0">
					<Table className="bg-white">
						<TableHeader className="sticky top-0 z-10 bg-white rounded-t-xl">
							<TableRow className="rounded-t-xl hover:bg-white">
								<TableHead>Title</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Duration</TableHead>
								<TableHead>Created at</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{[...Array(20)].map((_, index) => (
								<TableRow key={index}>
									<TableCellsSkeleton />
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
			<div className="absolute right-0 top-[-48px]">
				<div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
			</div>
		</div>
	);
};

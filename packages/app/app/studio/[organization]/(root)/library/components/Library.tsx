'use server';

import { fetchAllSessions } from '@/lib/services/sessionService';
import { Suspense } from 'react';
import EmptyLibrary from './EmptyLibrary';
import {
  IExtendedSession,
  eLayout,
  eSort,
} from '@/lib/types';

import { sortArray } from '@/lib/utils/utils';
import Pagination from './Pagination';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import TableCells from './TableCells';
import TableSort from '@/components/misc/TableSort';

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
    searchParams.sort
  ) as unknown as IExtendedSession[];

  return (
    <>
      {!sortedSessions || sortedSessions.length === 0 ? (
        <EmptyLibrary />
      ) : (
        <Table className="bg-white">
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow className="hover:bg-white">
              <TableHead className="cursor-pointer">
                <TableSort title="Title" sortBy="name" />
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="cursor-pointer">
                <TableSort title="Created at" sortBy="date" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="overflow-auto">
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
      )}
      <Pagination {...sessions.pagination} />
    </>
  );
};

export default Library;

const TableCellsSkeleton = () => {
  return (
    <>
      <TableCell className="p-2 md:p-2 relative font-medium w-[597px] h-20 animate-pulse">
        <div className="flex flex-row items-center space-x-4 w-full">
          <div className="min-w-[100px] bg-gray-200 h-12 w-24 animate-pulse" />
          <div className="flex flex-col w-full space-y-2">
            <div className="bg-gray-200 h-4 w-32 animate-pulse" />
            <div className="bg-gray-200 h-4 w-32 animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <div className="bg-gray-200 h-4 w-4 animate-pulse" />
          <div className="bg-gray-200 h-4 w-16 animate-pulse" />
        </div>
      </TableCell>
      <TableCell>
        <div className="bg-gray-200 h-4 w-16 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="bg-gray-200 h-4 w-32 animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-1">
          <div className="bg-gray-200 h-4 w-4 animate-pulse" />
          <div className="bg-gray-200 h-4 w-16 animate-pulse" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex justify-end items-center space-x-2 max-w-[100px]">
          <div className="bg-gray-200 h-8 w-8 animate-pulse" />
          <div className="bg-gray-200 h-8 w-8 animate-pulse" />
          <div className="bg-gray-200 h-8 w-8 animate-pulse" />
        </div>
      </TableCell>
    </>
  );
};

export const TableSkeleton = () => {
  return (
    <Table className="bg-white">
      <TableHeader className="sticky top-0 z-10 bg-white">
        <TableRow className="hover:bg-white">
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-auto">
        {[...Array(5)].map((_, index) => (
          <TableRow key={index}>
            <TableCellsSkeleton />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

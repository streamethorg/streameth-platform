'use server';
import { Suspense } from 'react';

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import TableCells from './TableCells';
import { IExtendedSession } from '@/lib/types';
import TableSort from '@/components/misc/TableSort';

const LibraryListLayout = async ({
  sessions,
  organizationSlug,
}: {
  sessions: IExtendedSession[];
  organizationSlug: string;
}) => {
  return (
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
        {sessions.map((item) => (
          <TableRow key={item._id}>
            <Suspense fallback={<TableCellsSkeleton />}>
              <TableCells item={item} organization={organizationSlug} />
            </Suspense>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LibraryListLayout;

const TableCellsSkeleton = () => {
  return (
    <>
      <TableCell className="relative font-medium max-w-[100px] animate-pulse">
        <div className="flex flex-row items-center space-x-4 w-full">
          <div className="min-w-[100px] bg-gray-200 h-12 w-24 animate-pulse" />
          <div className="flex flex-col space-y-2">
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

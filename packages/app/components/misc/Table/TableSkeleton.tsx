import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';

const TableSkeleton = () => {
  return (
    <Table className="w-full bg-white">
      <TableHeader className="sticky top-0 z-50 bg-white">
        <TableRow className="hover:bg-white">
          <TableHead>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
          </TableHead>
          <TableHead>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
          </TableHead>
          <TableHead>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
          </TableHead>
          <TableHead>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
          </TableHead>
          <TableHead>
            <div className="h-4 w-20 animate-pulse rounded bg-gray-300"></div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-scroll">
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            <TableCell>
              <div className="h-4 w-full rounded bg-gray-300"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-full rounded bg-gray-300"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-full rounded bg-gray-300"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-full rounded bg-gray-300"></div>
            </TableCell>
            <TableCell>
              <div className="h-4 w-full rounded bg-gray-300"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSkeleton;

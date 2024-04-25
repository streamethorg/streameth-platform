import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table'

const TableSkeleton = () => {
  return (
    <Table className="w-full bg-white">
      <TableHeader className="sticky top-0 z-50 bg-white">
        <TableRow className="hover:bg-white">
          <TableHead>
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
          </TableHead>
          <TableHead>
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
          </TableHead>
          <TableHead>
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
          </TableHead>
          <TableHead>
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
          </TableHead>
          <TableHead>
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="overflow-scroll">
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            <TableCell>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
            </TableCell>
            <TableCell>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
            </TableCell>
            <TableCell>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
            </TableCell>
            <TableCell>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
            </TableCell>
            <TableCell>
              <div className="w-full h-4 bg-gray-300 rounded"></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default TableSkeleton

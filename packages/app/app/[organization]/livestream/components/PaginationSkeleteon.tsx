const PaginationSkeleton = () => {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="flex flex-row justify-center items-center">
        {/* Left Arrow Skeleton */}
        <div className="p-2 rounded-full hover:bg-gray-100 animate-pulse">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>

        {/* Page Number Skeleton */}
        <div className="mx-2 animate-pulse">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Right Arrow Skeleton */}
        <div className="p-2 rounded-full hover:bg-gray-100 animate-pulse">
          <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default PaginationSkeleton

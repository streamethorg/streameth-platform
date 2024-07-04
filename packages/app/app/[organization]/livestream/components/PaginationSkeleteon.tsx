const PaginationSkeleton = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex flex-row items-center justify-center">
        {/* Left Arrow Skeleton */}
        <div className="animate-pulse rounded-full p-2 hover:bg-gray-100">
          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
        </div>

        {/* Page Number Skeleton */}
        <div className="mx-2 animate-pulse">
          <div className="h-6 w-24 rounded bg-gray-300"></div>
        </div>

        {/* Right Arrow Skeleton */}
        <div className="animate-pulse rounded-full p-2 hover:bg-gray-100">
          <div className="h-6 w-6 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default PaginationSkeleton;

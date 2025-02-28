export default function PlaylistVideoPlayerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full animate-pulse">
      {/* Main video section */}
      <div className="w-full lg:w-8/12 flex-shrink-0">
        {/* Video player */}
        <div className="bg-gray-200 aspect-video rounded-t-lg"></div>
        <div className="p-4 bg-white rounded-b-lg">
          <div className="h-7 bg-gray-200 w-3/4 rounded-md"></div>
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="flex flex-col gap-2">
                <div className="h-5 bg-gray-200 w-32 rounded-md"></div>
                <div className="h-3 bg-gray-200 w-48 rounded-md"></div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 lg:mt-0">
              <div className="h-8 bg-gray-200 w-20 rounded-md"></div>
              <div className="h-8 bg-gray-200 w-20 rounded-md"></div>
            </div>
          </div>
          <div className="mt-6">
            <div className="h-6 bg-gray-200 w-32 rounded-md mb-2"></div>
            <div className="h-4 bg-gray-200 w-full rounded-md"></div>
            <div className="h-4 bg-gray-200 w-4/5 rounded-md mt-2"></div>
            <div className="h-4 bg-gray-200 w-11/12 rounded-md mt-2"></div>
          </div>
        </div>
      </div>

      {/* Playlist sidebar */}
      <div className="w-full lg:w-4/12 bg-white rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 w-32 rounded-md"></div>
          <div className="h-4 bg-gray-200 w-16 rounded-md"></div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-2"
            >
              <div className="min-w-[120px] w-[120px] aspect-video bg-gray-300 rounded-lg"></div>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="h-4 bg-gray-200 w-full rounded-md"></div>
                <div className="h-4 bg-gray-200 w-11/12 rounded-md"></div>
                <div className="h-3 bg-gray-200 w-1/3 rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
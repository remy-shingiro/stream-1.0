const SkeletonLoader = () => {
  // Create an array of 12 items to simulate a full page of movies
  const placeholders = Array(12).fill(0);

  return (
    /* FIXED: Changed bg to slate-950 and removed top padding to match your "no-gap" home layout */
    <div className="min-h-screen bg-slate-950 p-4 md:p-8 pt-0 mt-0">
      
      {/* Navbar Skeleton */}
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4 h-20">
        <div className="h-8 w-32 bg-gray-800/50 rounded animate-pulse"></div>
        <div className="h-8 w-64 bg-gray-800/50 rounded-full animate-pulse hidden md:block"></div>
      </div>

      {/* Hero/Featured Skeleton */}
      {/* Reduced spacing here to match your tight Hero section */}
      <div className="w-full h-64 md:h-96 bg-gray-800/40 rounded-3xl animate-pulse mb-10 mt-2"></div>

      {/* Movie Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {placeholders.map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            {/* Poster */}
            <div className="w-full aspect-[2/3] bg-gray-800/40 rounded-2xl animate-pulse border border-white/5"></div>
            {/* Title Bar */}
            <div className="h-4 w-3/4 bg-gray-800/60 rounded animate-pulse mx-auto"></div>
            {/* Subtitle Bar */}
            <div className="h-3 w-1/2 bg-gray-900/80 rounded animate-pulse mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
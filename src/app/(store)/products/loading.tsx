export default function ProductsLoading() {
  return (
    <div className="max-w-6xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-8 animate-pulse grow flex flex-col w-full">
      {/* Title Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/25 pb-5">
        <div className="space-y-2">
          <div className="h-3 bg-secondary/30 rounded w-24" />
          <div className="h-8 bg-secondary/40 rounded w-48" />
        </div>
        <div className="h-4 bg-secondary/30 rounded w-36" />
      </div>

      {/* Control Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-secondary/10 border border-border/40 p-3.5 rounded-2xl">
        <div className="h-10 bg-secondary/40 rounded-xl w-full sm:w-80" />
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-4 bg-secondary/30 rounded w-12" />
          <div className="h-10 bg-secondary/40 rounded-xl w-32" />
        </div>
      </div>

      {/* Category Chips Scrollbar Skeleton */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-9 w-28 bg-secondary/40 rounded-full shrink-0" />
        ))}
      </div>

      {/* Products Grid Skeleton (8 Items) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="border border-border/40 rounded-2xl p-4.5 space-y-4">
            {/* Visual Box */}
            <div className="aspect-square bg-secondary/40 rounded-xl" />
            {/* Category tag */}
            <div className="h-3 bg-secondary/30 rounded-md w-16" />
            {/* Title */}
            <div className="h-4.5 bg-secondary/45 rounded-md w-3/4" />
            {/* Description lines */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3 bg-secondary/30 rounded-md w-full" />
              <div className="h-3 bg-secondary/30 rounded-md w-5/6" />
            </div>
            {/* Price & Add button */}
            <div className="flex justify-between items-center mt-3 pt-2">
              <div className="h-5 bg-secondary/40 rounded w-16" />
              <div className="h-9 w-9 bg-secondary/40 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

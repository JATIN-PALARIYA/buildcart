export default function HomeLoading() {
  return (
    <div className="pb-20 animate-pulse grow flex flex-col">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-secondary/10 pt-10 pb-12 lg:pt-14 lg:pb-16 border-b border-border/20">
        <div className="max-w-6xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content Skeleton */}
          <div className="space-y-6 max-w-xl">
            {/* Pill */}
            <div className="h-6 w-32 bg-secondary/40 rounded-full" />
            {/* Title lines */}
            <div className="space-y-3">
              <div className="h-10 bg-secondary/40 rounded-xl w-full" />
              <div className="h-10 bg-secondary/40 rounded-xl w-3/4" />
            </div>
            {/* Paragraph lines */}
            <div className="space-y-2 pt-2">
              <div className="h-4.5 bg-secondary/30 rounded-md w-full" />
              <div className="h-4.5 bg-secondary/30 rounded-md w-11/12" />
              <div className="h-4.5 bg-secondary/30 rounded-md w-5/6" />
            </div>
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <div className="h-11 bg-secondary/40 rounded-xl w-full sm:w-36" />
              <div className="h-11 bg-secondary/40 rounded-xl w-full sm:w-36" />
            </div>
          </div>

          {/* Right Banner Image Skeleton */}
          <div className="aspect-4/3 rounded-2xl bg-secondary/40 border border-border/20" />
        </div>
      </section>

      {/* Sub-sections layout with tighter top gap */}
      <div className="space-y-20 pt-10 lg:pt-14">

        {/* Featured Products Grid Skeleton */}
        <section className="max-w-6xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-border/25 pb-5">
          <div className="space-y-2">
            <div className="h-3 bg-secondary/30 rounded w-16" />
            <div className="h-6 bg-secondary/40 rounded w-48" />
          </div>
          <div className="h-4 bg-secondary/30 rounded w-28" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border/40 rounded-2xl p-4.5 space-y-4">
              <div className="aspect-square bg-secondary/40 rounded-xl" />
              <div className="h-3.5 bg-secondary/30 rounded-md w-16" />
              <div className="h-4 bg-secondary/40 rounded-md w-3/4" />
              <div className="h-3.5 bg-secondary/30 rounded-md w-full" />
              <div className="flex justify-between items-center mt-3 pt-2">
                <div className="h-5 bg-secondary/40 rounded w-12" />
                <div className="h-9 w-9 bg-secondary/40 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
      </div>
    </div>
  );
}

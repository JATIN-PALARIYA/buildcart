import React from "react";

export default function ProductDetailsLoading() {
  return (
    <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-pulse flex-grow flex flex-col w-full">
      {/* Back button link skeleton */}
      <div className="h-4 bg-secondary/35 rounded w-24" />

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        
        {/* Column 1: Image Gallery Skeleton */}
        <div className="space-y-4">
          {/* Main Showcase Image */}
          <div className="aspect-square bg-secondary/40 rounded-3xl" />
          {/* Thumbnails row */}
          <div className="grid grid-cols-4 gap-3.5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-secondary/30" />
            ))}
          </div>
        </div>

        {/* Column 2: Specifications Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3">
            {/* Category */}
            <div className="h-3 bg-secondary/30 rounded w-16" />
            {/* Title */}
            <div className="h-8 bg-secondary/40 rounded w-3/4" />
            {/* Price */}
            <div className="h-6 bg-secondary/40 rounded w-24 pt-1" />
          </div>

          <div className="h-px bg-border/40" />

          {/* Details & Description */}
          <div className="space-y-4">
            {/* Stock indicator */}
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-secondary/40" />
              <div className="h-3.5 bg-secondary/30 rounded w-32" />
            </div>
            {/* Paragraph lines */}
            <div className="space-y-2.5 pt-2">
              <div className="h-4 bg-secondary/30 rounded w-full" />
              <div className="h-4 bg-secondary/30 rounded w-11/12" />
              <div className="h-4 bg-secondary/30 rounded w-5/6" />
              <div className="h-4 bg-secondary/30 rounded w-3/4" />
            </div>
          </div>

          {/* Add-to-cart Controls */}
          <div className="space-y-4 pt-4 border-t border-border/40">
            <div className="space-y-2">
              <div className="h-3 bg-secondary/30 rounded w-24" />
              {/* Quantity selector box */}
              <div className="h-9 w-28 bg-secondary/40 rounded-lg" />
            </div>
            {/* CTA Button */}
            <div className="h-12 bg-secondary/45 rounded-xl w-full pt-1" />
          </div>
        </div>
      </div>

      {/* Related Products Skeleton */}
      <section className="space-y-6 pt-10 border-t border-border/30">
        <div className="space-y-2">
          <div className="h-3 bg-secondary/30 rounded w-20" />
          <div className="h-6 bg-secondary/40 rounded w-44" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="border border-border/40 rounded-2xl p-4.5 space-y-4">
              <div className="aspect-square bg-secondary/40 rounded-xl" />
              <div className="h-3 bg-secondary/30 rounded w-16" />
              <div className="h-4.5 bg-secondary/40 rounded w-3/4" />
              <div className="h-5 bg-secondary/35 rounded w-12 mt-2" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

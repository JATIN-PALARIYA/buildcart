import React from "react";

export default function CheckoutLoading() {
  return (
    <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse flex-grow flex flex-col w-full">
      {/* Title Header Skeleton */}
      <div className="border-b border-border/25 pb-5">
        <div className="h-3 bg-secondary/30 rounded w-20" />
        <div className="h-8 bg-secondary/40 rounded w-52 mt-1" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Skeleton */}
        <div className="lg:col-span-7 bg-card border border-border/40 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="h-4 bg-secondary/40 rounded w-32" />
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <div className="h-3 bg-secondary/30 rounded w-16" />
                <div className="h-10 bg-secondary/40 rounded-xl w-full" />
              </div>
              {/* Email Address */}
              <div className="space-y-2">
                <div className="h-3 bg-secondary/30 rounded w-20" />
                <div className="h-10 bg-secondary/40 rounded-xl w-full" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="h-3 bg-secondary/30 rounded w-24" />
              <div className="h-10 bg-secondary/40 rounded-xl w-full" />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <div className="h-3 bg-secondary/30 rounded w-28" />
              <div className="h-28 bg-secondary/40 rounded-xl w-full" />
            </div>

            {/* Submit Button */}
            <div className="h-12 bg-secondary/45 rounded-xl w-full pt-1" />
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar Skeleton */}
        <div className="lg:col-span-5 bg-secondary/10 border border-border/40 rounded-2xl p-6 space-y-6">
          <div className="h-4 bg-secondary/40 rounded w-28" />

          {/* Cart Item rows */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3.5 border-b border-border/15 pb-4 last:border-b-0 last:pb-0">
                {/* Thumbnail */}
                <div className="h-14 w-14 rounded-lg bg-secondary/40 shrink-0" />
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex justify-between items-center">
                    <div className="h-3.5 bg-secondary/45 rounded w-1/2" />
                    <div className="h-3.5 bg-secondary/45 rounded w-10" />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <div className="h-3 bg-secondary/30 rounded w-8" />
                    <div className="h-3 bg-secondary/30 rounded w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotals & Totals */}
          <div className="border-t border-border/40 pt-4 space-y-3">
            <div className="flex justify-between">
              <div className="h-3 bg-secondary/30 rounded w-16" />
              <div className="h-3 bg-secondary/30 rounded w-10" />
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-secondary/30 rounded w-12" />
              <div className="h-3 bg-secondary/30 rounded w-8 text-emerald-500" />
            </div>
            <div className="flex justify-between border-t border-border/20 pt-3">
              <div className="h-4 bg-secondary/45 rounded w-20" />
              <div className="h-4.5 bg-secondary/45 rounded w-14" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

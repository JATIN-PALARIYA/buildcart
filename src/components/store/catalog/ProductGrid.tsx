import React from "react";
import { RotateCcw, LayoutGrid } from "lucide-react";
import { Product } from "@/lib/types/product";
import { ProductCard } from "@/components/store/ProductCard";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  onResetFilters: () => void;
}

export function ProductGrid({ products, loading, onResetFilters }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 opacity-60">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="border border-border/40 rounded-2xl p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-square bg-secondary/30 rounded-xl" />
            <div className="h-4 bg-secondary/30 rounded-md w-2/3" />
            <div className="h-3 bg-secondary/30 rounded-md w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border/80 rounded-3xl py-20 px-4 text-center max-w-xl mx-auto space-y-5 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-secondary/40 border border-border/30 flex items-center justify-center mx-auto text-muted-foreground/60">
          <LayoutGrid className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">
            No matches found
          </h3>
          <p className="text-xs text-muted-foreground leading-normal max-w-sm mx-auto">
            We couldn&apos;t find any products matching your search. Try resetting your parameters.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
export default ProductGrid;

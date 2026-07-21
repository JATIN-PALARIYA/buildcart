import React from "react";

interface CatalogSortProps {
  value: string;
  onChange: (val: string) => void;
}

export function CatalogSort({ value, onChange }: CatalogSortProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-card text-xs font-semibold text-muted-foreground hover:text-foreground border border-border/80 rounded-xl px-3 py-2.5 outline-none cursor-pointer w-full sm:w-auto transition-colors"
      aria-label="Sort products"
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
export default CatalogSort;

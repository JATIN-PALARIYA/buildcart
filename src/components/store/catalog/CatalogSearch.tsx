import React from "react";
import { Search, X } from "lucide-react";

interface CatalogSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function CatalogSearch({ value, onChange, placeholder = "Search products..." }: CatalogSearchProps) {
  return (
    <div className="flex items-center gap-2.5 bg-card border border-border/80 rounded-xl px-4 py-3 w-full sm:max-w-md md:max-w-lg lg:max-w-xl focus-within:border-primary/60 transition-colors shadow-sm">
      <Search className="h-4.5 w-4.5 text-muted-foreground/60 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none w-full font-medium"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-muted-foreground/50 hover:text-foreground cursor-pointer shrink-0"
          aria-label="Clear Search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
export default CatalogSearch;

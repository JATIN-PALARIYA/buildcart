import React, { useRef } from "react";
import { Category } from "@/lib/types/category";
import {
  LayoutGrid,
  Laptop,
  Smartphone,
  Tablet,
  Cpu,
  HardDrive,
  Tv,
  Keyboard,
  Volume2,
  Cable,
  Wifi,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface CategoryScrollerProps {
  categories: Category[];
  selectedSlug: string;
  onSelectSlug: (slug: string) => void;
}

export function CategoryScroller({ categories, selectedSlug, onSelectSlug }: CategoryScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "windows-laptops":
        return <Laptop className="h-3 w-3 shrink-0" />;
      case "macbooks-macs":
        return <Laptop className="h-3 w-3 shrink-0" />;
      case "iphones":
        return <Smartphone className="h-3 w-3 shrink-0" />;
      case "android-phones":
        return <Smartphone className="h-3 w-3 shrink-0" />;
      case "tablets-ipads":
        return <Tablet className="h-3 w-3 shrink-0" />;
      case "ram-memory":
        return <Cpu className="h-3 w-3 shrink-0" />;
      case "ssds-storage":
        return <HardDrive className="h-3 w-3 shrink-0" />;
      case "hdds-storage":
        return <HardDrive className="h-3 w-3 shrink-0" />;
      case "graphics-cards":
        return <Cpu className="h-3 w-3 shrink-0" />;
      case "processors-cpus":
        return <Cpu className="h-3 w-3 shrink-0" />;
      case "monitors":
        return <Tv className="h-3 w-3 shrink-0" />;
      case "keyboards-input":
        return <Keyboard className="h-3 w-3 shrink-0" />;
      case "audio-speakers":
        return <Volume2 className="h-3 w-3 shrink-0" />;
      case "cables-adapters":
        return <Cable className="h-3 w-3 shrink-0" />;
      case "networking-routers":
        return <Wifi className="h-3 w-3 shrink-0" />;
      default:
        return <Laptop className="h-3 w-3 shrink-0" />;
    }
  };

  return (
    <div className="relative group border-b border-border/10 pb-2 w-full">
      {/* Outer Left Arrow Button (Minimalist, no background) */}
      <button
        onClick={() => scroll("left")}
        className="absolute -left-6 sm:-left-7 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-20 focus:outline-none"
        aria-label="Scroll Categories Left"
        title="Scroll Left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Scrollable Categories List */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none] py-0.5 w-full"
      >
        <button
          onClick={() => onSelectSlug("all")}
          className={`px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider border cursor-pointer shrink-0 transition-all inline-flex items-center gap-1.5 ${
            selectedSlug === "all"
              ? "bg-foreground text-background border-foreground shadow-sm"
              : "bg-card text-muted-foreground border-border/80 hover:text-foreground"
          }`}
        >
          <LayoutGrid className="h-3 w-3 shrink-0" />
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectSlug(cat.slug)}
            className={`px-2.5 py-1 rounded-full text-xxs font-bold uppercase tracking-wider border cursor-pointer shrink-0 transition-all inline-flex items-center gap-1.5 ${
              selectedSlug === cat.slug
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-card text-muted-foreground border-border/80 hover:text-foreground"
            }`}
          >
            {getCategoryIcon(cat.slug)}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Outer Right Arrow Button (Minimalist, no background) */}
      <button
        onClick={() => scroll("right")}
        className="absolute -right-6 sm:-right-7 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer z-20 focus:outline-none"
        aria-label="Scroll Categories Right"
        title="Scroll Right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
export default CategoryScroller;

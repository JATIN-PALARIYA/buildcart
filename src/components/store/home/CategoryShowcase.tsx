import React from "react";
import Link from "next/link";
import { Laptop, Smartphone, Tablet, Cpu, HardDrive, Tv, Keyboard, Volume2, Cable, Wifi } from "lucide-react";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";

interface CategoryShowcaseProps {
  categories: Category[];
  products: Product[];
}

export function CategoryShowcase({ categories, products }: CategoryShowcaseProps) {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "windows-laptops":
        return <Laptop className="h-5 w-5" />;
      case "macbooks-macs":
        return <Laptop className="h-5 w-5" />;
      case "iphones":
        return <Smartphone className="h-5 w-5" />;
      case "android-phones":
        return <Smartphone className="h-5 w-5" />;
      case "tablets-ipads":
        return <Tablet className="h-5 w-5" />;
      case "ram-memory":
        return <Cpu className="h-5 w-5" />;
      case "ssds-storage":
        return <HardDrive className="h-5 w-5" />;
      case "hdds-storage":
        return <HardDrive className="h-5 w-5" />;
      case "graphics-cards":
        return <Cpu className="h-5 w-5" />;
      case "processors-cpus":
        return <Cpu className="h-5 w-5" />;
      case "monitors":
        return <Tv className="h-5 w-5" />;
      case "keyboards-input":
        return <Keyboard className="h-5 w-5" />;
      case "audio-speakers":
        return <Volume2 className="h-5 w-5" />;
      case "cables-adapters":
        return <Cable className="h-5 w-5" />;
      case "networking-routers":
        return <Wifi className="h-5 w-5" />;
      default:
        return <Laptop className="h-5 w-5" />;
    }
  };

  return (
    <section className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-border/30 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          Categories
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
          Shop by Department
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const count = products.filter((p) => p.category.id === category.id).length;
          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between h-48"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/50 border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:bg-secondary transition-all">
                {getCategoryIcon(category.slug)}
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-normal">
                  {category.description}
                </p>
                <span className="text-[10px] font-bold text-muted-foreground mt-3 inline-block">
                  {count} {count === 1 ? "Product" : "Products"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
export default CategoryShowcase;

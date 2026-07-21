"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import ProductsLoading from "./loading";
import { CatalogSearch } from "@/components/store/catalog/CatalogSearch";
import { CatalogSort } from "@/components/store/catalog/CatalogSort";
import { CategoryScroller } from "@/components/store/catalog/CategoryScroller";
import { ProductGrid } from "@/components/store/catalog/ProductGrid";
import { getProducts } from "@/lib/api/product";
import { getCategories } from "@/lib/api/category";
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";

function ProductsList() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const fetched = await getCategories();
        setCategories(fetched);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    }
    loadCategories();
  }, []);

  // Sync category state when URL searchParams change
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Sync search input if URL search parameter changes
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, [searchParams]);

  // Fetch products from the API when query params change
  useEffect(() => {
    async function fetchCatalogProducts() {
      setIsSearching(true);
      try {
        const fetchedProducts = await getProducts({
          category: selectedCategory,
          search: searchQuery,
          sort: sortBy,
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch catalog products:", error);
      } finally {
        setIsSearching(false);
      }
    }
    fetchCatalogProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    const params = new URLSearchParams(window.location.search);
    if (categorySlug === "all") {
      params.delete("category");
    } else {
      params.set("category", categorySlug);
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params = new URLSearchParams(window.location.search);
    if (val === "") {
      params.delete("search");
    } else {
      params.set("search", val);
    }
    router.replace(`/products?${params.toString()}`, { scroll: false });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("featured");
    router.replace("/products");
  };

  return (
    <div className="max-w-6xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 space-y-8 grow flex flex-col w-full">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/30 pb-5">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
            Boutique Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            Browse All Gear
          </h1>
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          Showing {products.length} products
        </p>
      </div>

      {/* Control Bar: Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-secondary/15 dark:bg-secondary/5 border border-border/40 p-3.5 rounded-2xl shadow-[0_2px_8px_-3px_rgba(0,0,0,0.02)]">
        
        {/* Modular Search Box */}
        <CatalogSearch
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search items by name, category, or features..."
        />

        {/* Modular Sort Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Sort
          </span>
          <CatalogSort value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Modular Category Chips Scroller */}
      <CategoryScroller
        categories={categories}
        selectedSlug={selectedCategory}
        onSelectSlug={handleCategorySelect}
      />

      {/* Modular Products Grid Content */}
      <ProductGrid
        products={products}
        loading={isSearching}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsList />
    </Suspense>
  );
}

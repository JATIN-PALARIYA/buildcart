"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, CornerDownLeft, Laptop, Volume2, Keyboard, Lightbulb } from "lucide-react";
import { getProducts } from "@/lib/api/product";
import { Product } from "@/lib/types/product";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Click outside modal card to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Load products on mount/open
  useEffect(() => {
    if (isOpen) {
      async function loadSearchProducts() {
        try {
          // TODO: Fetch data from backend
          // TODO: Products API
          const fetched = await getProducts();
          setProducts(fetched);
        } catch (error) {
          console.error("Failed to load products for search:", error);
        }
      }
      loadSearchProducts();
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
      document.body.style.overflow = "hidden"; // Prevent page scroll
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Real-time matched products
  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      // Show first 4 trending products when empty
      return products.filter((p) => p.isActive).slice(0, 4);
    }
    const cleanQuery = query.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.category.name.toLowerCase().includes(cleanQuery))
    );
  }, [query, products]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard shortcuts (ArrowUp, ArrowDown, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredProducts.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredProducts.length) % Math.max(1, filteredProducts.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredProducts[selectedIndex]) {
          handleSelectProduct(filteredProducts[selectedIndex].slug);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredProducts, selectedIndex]);

  // Scroll focused element into view
  useEffect(() => {
    if (resultsRef.current) {
      const activeEl = resultsRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelectProduct = (slug: string) => {
    onClose();
    router.push(`/products/${slug}`);
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "workspaces":
        return <Laptop className="h-3.5 w-3.5 text-muted-foreground" />;
      case "audio":
        return <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />;
      case "peripherals":
        return <Keyboard className="h-3.5 w-3.5 text-muted-foreground" />;
      case "lighting":
        return <Lightbulb className="h-3.5 w-3.5 text-muted-foreground" />;
      default:
        return <Laptop className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-background/40 backdrop-blur-md flex items-start justify-center pt-2 px-4 animate-in fade-in duration-200 cursor-default"
    >
      {/* Search Card Container */}
      <div
        ref={modalRef}
        className="w-full max-w-3xl lg:max-w-4xl 2xl:max-w-5xl bg-card/95 border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[580px] z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Header Input bar */}
        <div className="relative border-b border-border/40 flex items-center px-6">
          <Search className="h-5 w-5 text-muted-foreground/70 mr-3.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gears, desks, acoustic speakers, lighting systems..."
            className="w-full bg-transparent border-0 outline-none py-5 text-base text-foreground placeholder:text-muted-foreground/60 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Results List */}
        <div ref={resultsRef} className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="px-3 py-1 text-[9px] uppercase font-bold tracking-wider text-muted-foreground/70">
              {query.trim() ? "Search Results" : "Trending Gear"}
            </span>

            <div className="mt-1.5 space-y-1">
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">No matches found for "{query}"</p>
                  <p className="text-xs text-muted-foreground/60">Try searching for other products, e.g. "Mat", "Aero", "Stand"</p>
                </div>
              ) : (
                filteredProducts.map((product, index) => {
                  const isActive = index === selectedIndex;
                  return (
                    <div
                      key={product.id}
                      data-active={isActive}
                      onClick={() => handleSelectProduct(product.slug)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer ${
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground/90 hover:text-foreground"
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="h-11 w-11 rounded-lg overflow-hidden border border-border bg-secondary/35 relative shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 py-0.5">
                        <div className="flex justify-between items-center gap-2">
                          <h4 className="text-[13px] font-bold truncate text-foreground leading-snug">
                            {product.name}
                          </h4>
                          <span className="text-sm font-bold text-foreground tabular-nums shrink-0">
                            ${product.price}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground font-semibold">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(product.category.slug)}
                            {product.category.name}
                          </span>
                          <span>•</span>
                          <span className={product.stock > 0 ? "text-muted-foreground/70" : "text-destructive font-bold"}>
                            {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
                          </span>
                        </div>
                      </div>

                      {/* Select indicator icon */}
                      {isActive && (
                        <div className="shrink-0 flex items-center justify-center text-muted-foreground animate-fade-in duration-100">
                          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-muted border border-border text-[9px] font-bold text-muted-foreground/80">
                            <CornerDownLeft className="h-2.5 w-2.5" />
                          </kbd>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-border/40 px-4 py-2.5 bg-secondary/20 flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
          <div className="flex gap-3">
            <span>
              <kbd className="bg-muted px-1 rounded border border-border font-bold">↑↓</kbd> navigate
            </span>
            <span>
              <kbd className="bg-muted px-1 rounded border border-border font-bold">↵</kbd> select
            </span>
            <span>
              <kbd className="bg-muted px-1.5 rounded border border-border font-bold">esc</kbd> close
            </span>
          </div>
          <span className="text-[9px] text-muted-foreground/60 select-none">BuildCart CmdK</span>
        </div>

      </div>
    </div>
  );
}

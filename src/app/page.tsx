"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { NewsletterForm } from "@/components/store/NewsletterForm";
import { Hero } from "@/components/store/home/Hero";
import { CategoryShowcase } from "@/components/store/home/CategoryShowcase";
import { BoutiquePhilosophy } from "@/components/store/home/BoutiquePhilosophy";
import { getProducts } from "@/lib/api/product";
import { getCategories } from "@/lib/api/category";
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // TODO: Fetch data from backend
        // TODO: Products API
        // TODO: Categories API
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load storefront data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const featuredProducts = products.filter((p) => p.isActive).slice(0, 4);

  return (
    <div className="pb-20 flex-grow flex flex-col">
      
      {/* Hero Banner Component */}
      <Hero />

      {/* Loading Skeleton or Dynamic Content */}
      {loading ? (
        <div className="flex flex-1 items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading boutique catalog...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-20 pt-10 lg:pt-14">

          {/* Featured Products Grid */}
          <section className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/30 pb-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Featured Gear
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
                  Curated Developer Essentials
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 group transition-colors"
              >
                View all products
                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {featuredProducts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-10">No products found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>

          {/* Category Showcase Departments */}
          <CategoryShowcase categories={categories} products={products} />

          {/* Boutique Philosophy Grid */}
          <BoutiquePhilosophy />

          {/* Newsletter Capture Section */}
          <section className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-b border-border/30 py-16 sm:py-20 text-center space-y-8 relative overflow-hidden bg-radial from-secondary/15 via-transparent to-transparent">
              {/* Soft background light */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-96 rounded-full bg-primary/5 blur-[90px] pointer-events-none" />

              <div className="space-y-3 max-w-xl mx-auto z-10">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80">
                  Weekly Dispatch
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  Subscribe to our boutique updates.
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Receive curated design hardware drops, keycap restocks, and limited designer collection announcements. Twice a month. No fluff.
                </p>
              </div>

              <div className="max-w-md mx-auto z-10">
                <NewsletterForm />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { Product } from "@/lib/types/product";
import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items } = useCart();
  const isOutOfStock = product.stock <= 0;
  
  // Check if item is already in cart to show a subtle indicator
  const cartItem = items.find((item) => item.product.id === product.id);
  const isInCart = !!cartItem;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem(product, 1);
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-card border border-border/50 hover:border-border rounded-2xl overflow-hidden shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.3)] hover:shadow-lg transition-all duration-300 h-full"
    >
      {/* Image Gallery Container */}
      <div className="aspect-square bg-secondary/30 relative overflow-hidden w-full">
        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <span className="bg-background border border-border text-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* Product Image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Hover Action Button (Add to Cart Shortcut) */}
        {!isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3.5 right-3.5 z-10 p-2.5 rounded-xl bg-background border border-border/80 text-foreground hover:bg-foreground hover:text-background hover:border-foreground shadow-md transition-all duration-300 hover:scale-105 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none pointer-events-auto cursor-pointer"
            title="Add to Cart"
            aria-label={`Add ${product.name} to cart`}
          >
            {isInCart ? (
              <Check className="h-4.5 w-4.5 text-emerald-500 group-hover:text-emerald-400" />
            ) : (
              <Plus className="h-4.5 w-4.5" />
            )}
          </button>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4.5 flex flex-col flex-1">
        <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold mb-1">
          {product.category.name}
        </span>
        
        <h3 className="text-sm font-semibold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-1">
          {product.name}
        </h3>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-foreground tabular-nums">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>

          {/* Inline Stock Warning */}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-[10px] text-amber-500 font-semibold">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

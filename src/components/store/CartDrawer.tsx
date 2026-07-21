"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { QuantitySelector } from "./QuantitySelector";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, cartSubtotal, cartCount } = useCart();

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/60 dark:bg-background/80 backdrop-blur-xs transition-opacity duration-300 ease-in-out cursor-pointer"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
        {/* Drawer Panel */}
        <div className="w-screen max-w-md pointer-events-auto transform transition-transform duration-300 ease-out border-l border-border bg-card shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-5 py-5 border-b border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-base font-semibold text-foreground">Shopping Cart</h2>
              {cartCount > 0 && (
                <span className="bg-primary/10 text-primary text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-border/60">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-full bg-secondary/40 border border-border/30 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-7 w-7 text-muted-foreground/60" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">Your cart is empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs mb-6 leading-relaxed">
                  Explore our premium tech workspace and audio gear catalogs to add items.
                </p>
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-xl bg-foreground px-4 py-2.5 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border/55 bg-secondary/20 relative">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={onClose}
                          className="text-xs font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors pr-2"
                        >
                          {item.product.name}
                        </Link>
                        <span className="text-xs font-bold text-foreground tabular-nums whitespace-nowrap">
                          ${(item.product.price * item.quantity).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block mt-0.5">
                        {item.product.category.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controller */}
                      <QuantitySelector
                        quantity={item.quantity}
                        max={item.product.stock}
                        onChange={(qty) => updateQuantity(item.product.id, qty)}
                      />

                      {/* Delete Button */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-lg hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer (Totals & Checkout Actions) */}
          {items.length > 0 && (
            <div className="border-t border-border/80 px-5 py-6 bg-secondary/20 dark:bg-secondary/10 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-semibold text-foreground">Free</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-foreground">
                  <span>Subtotal</span>
                  <span className="text-base font-bold tabular-nums">
                    ${cartSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-normal pt-1">
                  Free shipping on all premium items. Taxes and fees are simulated.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-xs font-bold text-background shadow-md hover:bg-foreground/95 transition-all duration-200 cursor-pointer group"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

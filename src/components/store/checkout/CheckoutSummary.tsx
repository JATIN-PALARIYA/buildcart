import React from "react";
import Image from "next/image";
import { CartItem } from "@/contexts/CartContext";

interface CheckoutSummaryProps {
  items: CartItem[];
  cartSubtotal: number;
  cartCount: number;
}

export function CheckoutSummary({ items, cartSubtotal, cartCount }: CheckoutSummaryProps) {
  return (
    <div className="bg-secondary/15 dark:bg-secondary/5 border border-border/55 rounded-2xl p-6 space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
        Order Summary
      </h2>

      {/* Cart review list */}
      <div className="divide-y divide-border/50 max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.product.id} className="py-3 flex gap-3.5 first:pt-0 last:pb-0">
            <div className="h-14 w-14 rounded-lg overflow-hidden border border-border bg-secondary/35 shrink-0 relative">
              <Image src={item.product.image} alt={item.product.name} fill sizes="56px" className="object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-0.5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-foreground line-clamp-1 pr-2">
                  {item.product.name}
                </span>
                <span className="text-xs font-bold text-foreground tabular-nums">
                  ${(item.product.price * item.quantity).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
                <span>Qty: {item.quantity}</span>
                <span>${item.product.price} each</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Items Total ({cartCount})</span>
          <span className="font-semibold text-foreground tabular-nums">
            ${cartSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Shipping</span>
          <span className="font-semibold text-foreground text-emerald-600 dark:text-emerald-500">Free</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-foreground border-t border-border/50 pt-3">
          <span>Total Amount</span>
          <span className="text-base tabular-nums">
            ${cartSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
}
export default CheckoutSummary;

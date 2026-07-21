import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface CheckoutSuccessProps {
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
}

export function CheckoutSuccess({
  orderId,
  customerName,
  customerPhone,
  totalAmount,
}: CheckoutSuccessProps) {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in zoom-in-95 duration-350">
      <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-9 w-9" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Order Placed Successfully!
        </h2>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
          Thank you for shopping with BuildCart. Your order has been successfully sent to the server for processing.
        </p>
      </div>

      {/* Receipt Details */}
      <div className="bg-secondary/40 border border-border/80 rounded-2xl p-4.5 text-left text-xs space-y-2.5 max-w-sm mx-auto font-medium">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Order Reference:</span>
          <span className="font-bold text-foreground tabular-nums uppercase">{orderId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ship To:</span>
          <span className="font-bold text-foreground truncate max-w-[200px]">{customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Contact:</span>
          <span className="font-bold text-foreground tabular-nums">{customerPhone}</span>
        </div>
        <div className="flex justify-between border-t border-border/50 pt-2.5 mt-1">
          <span className="text-muted-foreground font-semibold">Total Amount:</span>
          <span className="font-bold text-foreground text-sm tabular-nums">
            ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="pt-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          Continue Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
export default CheckoutSuccess;

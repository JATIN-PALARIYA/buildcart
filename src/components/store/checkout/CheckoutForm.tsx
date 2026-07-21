import React from "react";
import { CreditCard, Loader2 } from "lucide-react";

interface CheckoutFormProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  cartSubtotal: number;
}

export function CheckoutForm({
  formData,
  onInputChange,
  onSubmit,
  isSubmitting,
  cartSubtotal,
}: CheckoutFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-[11px] font-bold text-muted-foreground uppercase">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={onInputChange}
            placeholder="John Doe"
            className="w-full px-4 py-2.5 bg-background border border-border/70 hover:border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/50"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[11px] font-bold text-muted-foreground uppercase">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            placeholder="john@example.com"
            className="w-full px-4 py-2.5 bg-background border border-border/70 hover:border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/50"
          />
        </div>
      </div>

      {/* Contact Phone */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="text-[11px] font-bold text-muted-foreground uppercase">
          Contact Phone *
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          required
          value={formData.phone}
          onChange={onInputChange}
          placeholder="+91 98765 43210"
          className="w-full px-4 py-2.5 bg-background border border-border/70 hover:border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/50"
        />
      </div>

      {/* Shipping Address */}
      <div className="space-y-1.5">
        <label htmlFor="address" className="text-[11px] font-bold text-muted-foreground uppercase">
          Delivery Address *
        </label>
        <textarea
          id="address"
          name="address"
          required
          rows={4}
          value={formData.address}
          onChange={onInputChange}
          placeholder="Apartment, Street name, City, Postal Code"
          className="w-full px-4 py-2.5 bg-background border border-border/70 hover:border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring/50 resize-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-xs font-bold text-background shadow-md hover:bg-foreground/95 disabled:bg-foreground/60 disabled:cursor-not-allowed transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
              Submitting order...
            </>
          ) : (
            <>
              <CreditCard className="h-4.5 w-4.5" />
              Place Order (${cartSubtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })})
            </>
          )}
        </button>
      </div>
    </form>
  );
}
export default CheckoutForm;

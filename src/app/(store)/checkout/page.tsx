"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, AlertCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import CheckoutLoading from "./loading";
import { CheckoutForm } from "@/components/store/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/store/checkout/CheckoutSummary";
import { CheckoutSuccess } from "@/components/store/checkout/CheckoutSuccess";
import { createOrder } from "@/lib/api/order";

export default function CheckoutPage() {
  const { items, cartSubtotal, cartCount, clearCart, isLoaded } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // UI Processing States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [simulatedOrderId, setSimulatedOrderId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Checkout API
      // TODO: Payment Integration
      // TODO: Shipping calculation
      // TODO: Tax calculation
      const orderPayload = {
        customerName: formData.name,
        customerEmail: formData.email || undefined,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        products: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const placedOrder = await createOrder(orderPayload);
      setSimulatedOrderId(placedOrder.id);
      setIsSuccess(true);
      clearCart();
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Failed to place order. Please check backend integration.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Success Screen
  if (isSuccess) {
    return (
      <CheckoutSuccess
        orderId={simulatedOrderId}
        customerName={formData.name}
        customerPhone={formData.phone}
        totalAmount={cartSubtotal}
      />
    );
  }

  // 2. Loading State check
  if (!isLoaded) {
    return <CheckoutLoading />;
  }

  // 3. Empty Cart Block
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-secondary/40 border border-border/30 flex items-center justify-center mx-auto text-muted-foreground/60">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Checkout is empty</h2>
          <p className="text-xs text-muted-foreground leading-normal max-w-sm mx-auto">
            You must add items to your shopping cart from the product listings catalog before performing checkout operations.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 rounded-xl bg-foreground px-5 py-3 text-xs font-semibold text-background hover:bg-foreground/90 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  // 4. Main Checkout Layout
  return (
    <div className="max-w-6xl 2xl:max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 grow flex flex-col w-full">
      {/* Title Header */}
      <div className="border-b border-border/30 pb-5">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
          Secure Checkout
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
          Complete Your Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Checkout Fields Form */}
        <div className="lg:col-span-7 bg-card border border-border/70 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Shipping Information
          </h2>

          {error && (
            <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-xl flex gap-2 items-start text-destructive text-xs">
              <AlertCircle className="shrink-0 h-4.5 w-4.5 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <CheckoutForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            cartSubtotal={cartSubtotal}
          />
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <CheckoutSummary
            items={items}
            cartSubtotal={cartSubtotal}
            cartCount={cartCount}
          />
        </div>
      </div>
    </div>
  );
}

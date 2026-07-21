"use client";

import { Minus, Plus } from "lucide-react";
import React from "react";

interface QuantitySelectorProps {
  quantity: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onChange,
  max,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (max === undefined || quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center border border-border/80 rounded-lg bg-card overflow-hidden w-fit h-9">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        className="px-2.5 h-full flex items-center justify-center hover:bg-secondary text-muted-foreground disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-xs font-semibold tabular-nums select-none text-foreground">
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && quantity >= max)}
        className="px-2.5 h-full flex items-center justify-center hover:bg-secondary text-muted-foreground disabled:opacity-35 disabled:hover:bg-transparent transition-colors cursor-pointer"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import { Order, Product } from "@/contexts/AdminContext";

interface OrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  products: Product[];
  onStatusChange: (id: string, newStatus: Order["status"]) => Promise<void>;
}

export function OrderDetailDrawer({
  isOpen,
  onClose,
  order,
  products,
  onStatusChange,
}: OrderDetailDrawerProps) {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!isOpen || !order) return null;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Order["status"];
    setIsUpdatingStatus(true);
    try {
      await onStatusChange(order.id, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getProductDetails = (item: { product: Product | null; productId: string }) => {
    if (item.product) {
      return {
        name: item.product.name,
        image: item.product.images?.[0] || item.product.image || null,
      };
    }
    const prod = products.find((p) => p.id === item.productId);
    return {
      name: prod ? prod.name : "Product Item",
      image: prod ? (prod.images?.[0] || prod.image || null) : null,
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-end z-50 animate-fade-in">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-card border-l border-border w-full max-w-md h-full p-6 shadow-md flex flex-col relative animate-slide-in overflow-y-auto z-10 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="mb-5 border-b border-border pb-3">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Order Details</span>
          <h3 className="text-base font-semibold text-foreground mt-1 select-all font-mono text-xs">ID: {order.id}</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Created: {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Status Manager Panel */}
        <div className="bg-muted/40 border border-border rounded-xl p-4 mb-5 flex items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Current Status
            </span>
            <Badge status={order.status} showIcon />
          </div>
          <div className="shrink-0">
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
              Update Status
            </span>
            <select
              value={order.status}
              onChange={handleStatusChange}
              disabled={isUpdatingStatus}
              className="bg-background border border-border text-foreground text-xs rounded-lg px-2.5 py-1 outline-none focus:ring-1 focus:ring-primary transition-all font-semibold cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Customer Details Box */}
        <div className="bg-muted/20 border border-border/80 rounded-xl p-4 mb-5 space-y-3">
          <h4 className="text-xs font-semibold text-foreground border-b border-border pb-1.5">
            Customer Information
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User size={13} className="shrink-0 text-muted-foreground/75" />
              <span className="text-foreground font-medium">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={13} className="shrink-0 text-muted-foreground/75" />
              <span className="text-foreground font-mono">{order.customerPhone}</span>
            </div>
            {order.customerEmail && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={13} className="shrink-0 text-muted-foreground/75" />
                <span className="text-foreground truncate select-all">{order.customerEmail}</span>
              </div>
            )}
            <div className="flex gap-2 text-muted-foreground items-start">
              <MapPin size={13} className="shrink-0 text-muted-foreground/75 mt-0.5" />
              <span className="text-foreground leading-relaxed">{order.shippingAddress}</span>
            </div>
          </div>
        </div>

        {/* Items Ordered List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <h4 className="text-xs font-semibold text-foreground border-b border-border pb-1.5 flex items-center gap-1.5">
            <ShoppingBag size={13} />
            Ordered Items
          </h4>
          <div className="space-y-2.5">
            {order.products.map((item, idx) => {
              const details = getProductDetails(item);
              return (
                <div
                  key={`${item.productId}-${idx}`}
                  className="flex items-center justify-between p-2.5 bg-muted/10 border border-border/70 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="h-8 w-8 bg-muted rounded-md overflow-hidden flex items-center justify-center shrink-0 border border-border">
                      {details.image ? (
                        <img src={details.image} alt={details.name} className="h-full w-full object-cover" />
                      ) : (
                        <ShoppingBag size={12} className="text-muted-foreground/45" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-[150px]">
                        {details.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-foreground shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="pt-4 border-t border-border mt-5 flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Total Paid:</span>
          <span className="text-base font-bold text-foreground bg-secondary px-3 py-1 rounded-lg border border-border">
            {formatCurrency(order.totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
export default OrderDetailDrawer;

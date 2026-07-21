"use client";

import React, { useState } from "react";
import { useAdmin, Order } from "@/contexts/AdminContext";
import { OrderDetailDrawer } from "@/components/admin/orders/OrderDetailDrawer";
import { OrderTable } from "@/components/admin/orders/OrderTable";

export default function AdminOrdersPage() {
  const { orders, products, updateOrderStatus } = useAdmin();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    try {
      const updated = await updateOrderStatus(id, newStatus);
      setSelectedOrder(updated); // Sync details drawer state
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Orders</h2>
          <p className="text-muted-foreground text-xs">Fulfill purchases, update shipping details, and track statuses</p>
        </div>
      </div>

      {/* Decoupled Order Table Component */}
      <OrderTable
        orders={orders}
        onOpenDetails={handleOpenDetails}
      />

      {/* Details Side-out Drawer */}
      <OrderDetailDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        order={selectedOrder}
        products={products}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}

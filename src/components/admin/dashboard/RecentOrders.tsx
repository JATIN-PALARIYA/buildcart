import React from "react";
import Link from "next/link";
import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Clock, ArrowRight } from "lucide-react";

export function RecentOrders() {
  const { orders } = useAdmin();

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Clock size={16} className="text-muted-foreground" />
            Recent Orders
          </h3>
          <p className="text-xxs text-muted-foreground">Latest active checkouts</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-[11px] font-semibold text-primary hover:opacity-85 transition-opacity flex items-center gap-0.5"
        >
          View All
          <ArrowRight size={12} />
        </Link>
      </CardHeader>

      <div className="flex-1 space-y-3 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground text-xs">
            No orders registered yet
          </div>
        ) : (
          recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 bg-muted/30 border border-border/80 hover:border-border rounded-lg transition-all"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs font-semibold text-foreground truncate">{order.customerName}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-xs font-semibold text-foreground">{formatCurrency(order.totalAmount)}</span>
                <Badge status={order.status} showIcon />
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
export default RecentOrders;

import React from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Card } from "@/components/ui/Card";
import { DollarSign, Package, FolderTree, ShoppingBag, ArrowUpRight, ArrowDownRight, AlertCircle } from "lucide-react";

export function DashboardMetrics() {
  const { products, categories, orders } = useAdmin();

  // Calculate metrics dynamically
  const totalSales = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeProductsCount = products.filter((p) => p.isActive).length;
  const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;

  // Calculate dynamic weekly sales growth
  const now = new Date();
  const getDaysAgo = (days: number) => {
    const res = new Date(now);
    res.setDate(now.getDate() - days);
    res.setHours(0, 0, 0, 0);
    return res;
  };

  const thisWeekStart = getDaysAgo(7);
  const lastWeekStart = getDaysAgo(14);

  const thisWeekSales = orders
    .filter((o) => o.status !== "cancelled" && new Date(o.createdAt) >= thisWeekStart)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lastWeekSales = orders
    .filter((o) => o.status !== "cancelled" && new Date(o.createdAt) >= lastWeekStart && new Date(o.createdAt) < thisWeekStart)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  let growthPercentage = 0;
  if (lastWeekSales > 0) {
    growthPercentage = Math.round(((thisWeekSales - lastWeekSales) / lastWeekSales) * 1000) / 10;
  } else if (thisWeekSales > 0) {
    growthPercentage = 100;
  }

  const isPositive = growthPercentage >= 0;
  const growthText = `${isPositive ? "+" : ""}${growthPercentage}%`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Sales Stats Card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</span>
          <div className="p-2 bg-secondary text-muted-foreground rounded-lg border border-border">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight">{formatCurrency(totalSales)}</div>
        <div className={`text-[10px] font-semibold mt-2 flex items-center gap-1 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
          {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          <span>{growthText}</span>
          <span className="text-muted-foreground font-normal">from last week</span>
        </div>
      </Card>

      {/* Active Products Card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Products</span>
          <div className="p-2 bg-secondary text-muted-foreground rounded-lg border border-border">
            <Package className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight">{activeProductsCount}</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-2">
          <span className="text-foreground font-semibold">{products.length}</span> total items cataloged
        </div>
      </Card>

      {/* Total Categories Card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</span>
          <div className="p-2 bg-secondary text-muted-foreground rounded-lg border border-border">
            <FolderTree className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight">{categories.length}</div>
        <div className="text-[10px] text-muted-foreground font-medium mt-2">
          Organized navigation collections
        </div>
      </Card>

      {/* Pending Orders Card */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Orders</span>
          <div className="p-2 bg-secondary text-muted-foreground rounded-lg border border-border">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold text-foreground tracking-tight">{pendingOrdersCount}</div>
        <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-2 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>Requires review</span>
          <span className="text-muted-foreground font-normal">
            ({orders.filter((o) => o.status === "processing").length} in progress)
          </span>
        </div>
      </Card>
    </div>
  );
}
export default DashboardMetrics;

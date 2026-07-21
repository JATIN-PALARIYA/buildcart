"use client";

import DashboardMetrics from "@/components/admin/dashboard/DashboardMetrics";
import SalesTrendChart from "@/components/admin/dashboard/SalesTrendChart";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome header info */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Performance Overview</h2>
        <p className="text-muted-foreground text-xs">Real-time statistics for your store</p>
      </div>

      {/* KPI Cards Row */}
      <DashboardMetrics />

      {/* Main Grid: Graph and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>
        <div>
          <RecentOrders />
        </div>
      </div>
    </div>
  );
}

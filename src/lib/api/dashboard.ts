const API_BASE_URL = "/api";

export interface DashboardKPIs {
  totalRevenue: number;
  activeProductsCount: number;
  categoriesCount: number;
  pendingOrdersCount: number;
  processingOrdersCount: number;
  totalProductsCount: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface DashboardMetricsResponse {
  kpis: DashboardKPIs;
  weeklySales: ChartDataPoint[];
  monthlySales: ChartDataPoint[];
}

export async function getDashboardMetrics(): Promise<DashboardMetricsResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to fetch dashboard metrics");
  }
  return await response.json();
}

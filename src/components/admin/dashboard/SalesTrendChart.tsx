import React, { useState, useEffect } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { TrendingUp, Loader2 } from "lucide-react";
import { getDashboardMetrics, ChartDataPoint } from "@/lib/api/dashboard";

export function SalesTrendChart() {
  const [chartTimeline, setChartTimeline] = useState<"weekly" | "monthly">("weekly");
  const [weeklyData, setWeeklyData] = useState<ChartDataPoint[]>([]);
  const [monthlyData, setMonthlyData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChartData() {
      try {
        // TODO: Dashboard analytics API
        const data = await getDashboardMetrics();
        setWeeklyData(data.weeklySales);
        setMonthlyData(data.monthlySales);
      } catch (error) {
        console.error("Failed to load chart metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    loadChartData();
  }, []);

  const activeChartData = chartTimeline === "weekly" ? weeklyData : monthlyData;
  const maxVal = activeChartData.length > 0 ? Math.max(...activeChartData.map((d) => d.value)) : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className="flex flex-col min-h-[380px]">
      <CardHeader>
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <TrendingUp size={16} className="text-muted-foreground" />
            Sales Trend
          </h3>
          <p className="text-xxs text-muted-foreground">Value of items purchased in USD</p>
        </div>
        <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
          <button
            onClick={() => setChartTimeline("weekly")}
            disabled={loading}
            className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${chartTimeline === "weekly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setChartTimeline("monthly")}
            disabled={loading}
            className={`px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${chartTimeline === "monthly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Monthly
          </button>
        </div>
      </CardHeader>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : activeChartData.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-xs text-muted-foreground">
          No trend data found
        </div>
      ) : (
        /* SVG Graph Drawing */
        <div className="mt-4 flex gap-4">
          {/* Y-Axis Labels */}
          <div className="flex flex-col justify-between text-[10px] font-semibold text-muted-foreground/60 h-[300px] pb-6 text-right shrink-0 min-w-[45px] font-mono">
            <span>{formatCurrency(maxVal)}</span>
            <span>{formatCurrency(maxVal * 0.75)}</span>
            <span>{formatCurrency(maxVal * 0.5)}</span>
            <span>{formatCurrency(maxVal * 0.25)}</span>
            <span>$0</span>
          </div>

          {/* Chart Area */}
          <div className="flex-1 h-[320px] flex flex-col justify-between relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none h-[300px] pb-2">
              <div className="border-t border-dashed border-border/40 w-full" />
              <div className="border-t border-dashed border-border/40 w-full" />
              <div className="border-t border-dashed border-border/40 w-full" />
              <div className="border-t border-dashed border-border/40 w-full" />
              <div className="border-t border-border w-full" />
            </div>

            {/* Bars Grid */}
            <div className="flex-1 flex items-end justify-between px-2 gap-4 border-b border-border pb-2 h-[300px] z-10 relative">
              {activeChartData.map((item) => {
                const percentageHeight = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                return (
                  <div key={item.label} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-8 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-20 font-mono">
                      {formatCurrency(item.value)}
                    </div>

                    {/* Interactive Bar */}
                    <div
                      className="w-full sm:w-8 bg-primary/80 hover:bg-primary rounded-t-md transition-all duration-300 relative cursor-pointer hover:shadow-md"
                      style={{ height: `${percentageHeight}%` }}
                    >
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-t-md transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Labels Row */}
            <div className="flex justify-between px-2 pt-2 h-6">
              {activeChartData.map((item) => (
                <span key={item.label} className="text-[10px] font-semibold text-muted-foreground flex-1 text-center truncate">
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
export default SalesTrendChart;

import React from "react";
import { Store } from "lucide-react";
import { Card } from "@/components/ui/Card";

export function StoreDetailsCard() {
  return (
    <Card className="space-y-3 lg:min-h-[300px] flex flex-col justify-between p-4">
      <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5 border-b border-border pb-2">
        <Store size={14} className="text-muted-foreground" />
        Store Details
      </h4>

      <div className="space-y-3">
        <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Store Name</span>
          <span className="text-xs font-bold text-foreground">BuildCart Megastore</span>
        </div>

        <div className="p-3 bg-muted/20 border border-border/60 rounded-xl space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Domain Link</span>
          <a
            href="https://megastore.buildcart.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono text-primary hover:underline inline-flex items-center gap-1"
          >
            megastore.buildcart.io
          </a>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 p-3 bg-muted/20 border border-border/60 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Currency</span>
            <span className="text-xs font-semibold text-foreground">USD ($)</span>
          </div>

          <div className="flex-1 p-3 bg-muted/20 border border-border/60 rounded-xl space-y-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Status</span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Online
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
export default StoreDetailsCard;

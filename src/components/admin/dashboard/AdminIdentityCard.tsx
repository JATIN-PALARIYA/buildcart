import React from "react";
import { Shield, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AdminUser } from "@/contexts/AdminContext";

interface AdminIdentityCardProps {
  adminUser: AdminUser | null;
}

export function AdminIdentityCard({ adminUser }: AdminIdentityCardProps) {
  return (
    <Card className="text-center flex flex-col items-center justify-between py-4 px-4 lg:min-h-[235px] p-4">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-xl font-bold text-primary-foreground border border-border shadow-sm mb-4">
          {adminUser?.name?.charAt(0) || "A"}
        </div>
        <h3 className="text-sm font-semibold text-foreground">{adminUser?.name}</h3>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold mt-1">
          Active Administrator
        </span>
      </div>

      <div className="w-full border-t border-border mt-4 pt-4 text-left space-y-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield size={14} className="shrink-0" />
          <span>Role: <strong className="text-foreground capitalize">{adminUser?.role}</strong></span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar size={14} className="shrink-0" />
          <span>Joined: <strong className="text-foreground">July 2026</strong></span>
        </div>
      </div>
    </Card>
  );
}
export default AdminIdentityCard;

import React from "react";
import { Clock, Loader2, Truck, CheckCircle2, XCircle } from "lucide-react";

type BadgeStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "active"
  | "draft";

interface BadgeProps {
  status: BadgeStatus;
  showIcon?: boolean;
}

export function Badge({ status, showIcon = false }: BadgeProps) {
  const getBadgeClass = (status: BadgeStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
      case "shipped":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
      case "delivered":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "draft":
        return "bg-muted text-muted-foreground border border-border";
    }
  };

  const getIcon = (status: BadgeStatus) => {
    const size = 11;
    switch (status) {
      case "pending":
        return <Clock size={size} className="text-amber-500 shrink-0" />;
      case "processing":
        return <Loader2 size={size} className="text-blue-500 animate-spin shrink-0" />;
      case "shipped":
        return <Truck size={size} className="text-indigo-500 shrink-0" />;
      case "delivered":
        return <CheckCircle2 size={size} className="text-emerald-500 shrink-0" />;
      case "cancelled":
        return <XCircle size={size} className="text-rose-500 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border capitalize inline-flex items-center gap-1.5 ${getBadgeClass(
        status
      )}`}
    >
      {showIcon && getIcon(status)}
      {status}
    </span>
  );
}

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, Eye } from "lucide-react";
import { Order } from "@/lib/types/order";
import { Badge } from "@/components/ui/Badge";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function getOrderColumns(
  onOpenDetails: (order: Order) => void
): ColumnDef<Order>[] {
  return [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-primary font-semibold select-all">{row.original.id}</span>
      ),
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
        >
          Customer
          {column.getIsSorted() === "asc" ? (
            <ChevronUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronsUpDown size={14} />
          )}
        </button>
      ),
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm">{row.original.customerName}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{row.original.customerPhone}</p>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
        >
          Date
          {column.getIsSorted() === "asc" ? (
            <ChevronUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronsUpDown size={14} />
          )}
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs">
          {new Date(row.original.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "items",
      header: "Items",
      cell: ({ row }) => {
        const count = row.original.products.reduce((sum, item) => sum + item.quantity, 0);
        return <span className="text-foreground text-xs">{count}</span>;
      },
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
        >
          Total
          {column.getIsSorted() === "asc" ? (
            <ChevronUp size={14} />
          ) : column.getIsSorted() === "desc" ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronsUpDown size={14} />
          )}
        </button>
      ),
      cell: ({ row }) => <span className="font-semibold text-foreground">{formatCurrency(row.original.totalAmount)}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge status={row.original.status} showIcon />,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <button
            onClick={() => onOpenDetails(row.original)}
            className="px-2.5 py-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border border-border transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-semibold"
          >
            <Eye size={12} />
            Details
          </button>
        </div>
      ),
    },
  ];
}
export default getOrderColumns;

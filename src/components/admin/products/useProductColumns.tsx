import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronUp, ChevronDown, ChevronsUpDown, FileImage, Edit2, Trash2 } from "lucide-react";
import { Product } from "@/lib/types/product";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function getProductColumns(
  onEdit: (product: Product) => void,
  onDelete: (id: string) => void
): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
        >
          Product
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
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-muted rounded-lg overflow-hidden flex items-center justify-center border border-border shrink-0">
            {row.original.images[0] ? (
              <img src={row.original.images[0]} alt={row.original.name} className="h-full w-full object-cover" />
            ) : (
              <FileImage size={16} className="text-muted-foreground/50" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate max-w-[180px]">{row.original.name}</p>
            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[180px]">{row.original.slug}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <span className="text-foreground text-xs">{row.original.category?.name || "Unassigned"}</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span className="font-medium text-foreground">{formatCurrency(row.original.price)}</span>,
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className={`font-semibold ${row.original.stock < 10 ? "text-amber-500" : "text-foreground"}`}>
            {row.original.stock}
          </span>
          {row.original.stock < 10 && (
            <span className="text-[9px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded-md font-semibold">
              Low Stock
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) =>
        row.original.isActive ? (
          <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-semibold">
            Active
          </span>
        ) : (
          <span className="bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full text-[10px] font-semibold">
            Draft
          </span>
        ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => onEdit(row.original)}
            className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg border border-border transition-colors cursor-pointer"
            title="Edit"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onDelete(row.original.id)}
            className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg border border-border hover:border-destructive/20 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];
}

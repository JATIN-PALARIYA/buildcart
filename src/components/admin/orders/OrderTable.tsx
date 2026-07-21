"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Order } from "@/lib/types/order";
import { getOrderColumns } from "./useOrderColumns";

interface OrderTableProps {
  orders: Order[];
  onOpenDetails: (order: Order) => void;
}

export function OrderTable({ orders, onOpenDetails }: OrderTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");

  // Custom filtering: Status filter
  const filteredData = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesStatus;
    });
  }, [orders, statusFilter]);

  // Define columns using external generator
  const columns = useMemo(
    () => getOrderColumns(onOpenDetails),
    [onOpenDetails]
  );

  // TanStack Table Instance
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const val = row.getValue(columnId);
      if (!val) return false;
      return String(val).toLowerCase().includes(String(filterValue).toLowerCase());
    },
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Filtering Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border border-border w-full sm:max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground/70 shrink-0" />
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search orders by customer..."
            className="bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none w-full"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order["status"] | "all")}
          className="bg-card text-sm text-foreground border border-border rounded-lg px-3 py-2 outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border bg-muted/40">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-3.5 text-xs font-bold text-muted-foreground tracking-wider select-none uppercase"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/60">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-10 text-xs text-muted-foreground font-medium">
                    No orders registered yet.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-3 text-xs font-medium text-muted-foreground"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-card">
          <div className="text-[10px] text-muted-foreground font-semibold">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 bg-background border border-border hover:bg-muted/40 text-[10px] font-semibold text-foreground rounded-lg disabled:opacity-55 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 bg-background border border-border hover:bg-muted/40 text-[10px] font-semibold text-foreground rounded-lg disabled:opacity-55 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default OrderTable;

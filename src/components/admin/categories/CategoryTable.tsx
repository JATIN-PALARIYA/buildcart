import React, { useState, useMemo } from "react";
import { Category } from "@/contexts/AdminContext";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  Search,
  Edit2,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
}

export function CategoryTable({ categories, onEdit }: CategoryTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Define columns for TanStack Table
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1.5 hover:text-foreground transition-colors cursor-pointer"
          >
            Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp size={14} />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronsUpDown size={14} />
            )}
          </button>
        ),
        cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.name}</span>,
      },
      {
        accessorKey: "slug",
        header: "Slug",
        cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.slug}</span>,
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs line-clamp-1 max-w-[240px]">
            {row.original.description || <em className="text-muted-foreground/60">No description</em>}
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
          </div>
        ),
      },
    ],
    [onEdit]
  );

  // TanStack Table Instance
  const table = useReactTable({
    data: categories,
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
        pageSize: 8,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border border-border max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground/70 shrink-0" />
        <input
          type="text"
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search categories..."
          className="bg-transparent text-sm text-foreground placeholder-muted-foreground/50 outline-none w-full"
        />
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
                      className="px-6 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10 text-center text-muted-foreground text-sm">
                    No categories found.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3 text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Row */}
        {table.getPageCount() > 1 && (
          <div className="px-6 py-3.5 border-t border-border bg-muted/20 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1 border border-border rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1 border border-border rounded hover:bg-muted/80 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default CategoryTable;

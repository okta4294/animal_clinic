"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditModal } from "./edit-modal"
import { toast } from "sonner"

// tipe data baru
export type DailyRecord = {
  id: string
  animal_id: string
  inspection_date : string
  animal_weight : number
  drug_name: string
  dosage: string
  food_given: string
  balance_food_take_out: string
  dopping_consistency : string
  animal_behavior : string
}

// kolom tabel baru
export const columns: ColumnDef<DailyRecord>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "animal_id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Animal Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("animal_id")}</div>,
  },
  {
    accessorKey: "inspection_date",
    header: "Date",
    cell: ({ row }) => {
      const val = row.getValue("inspection_date") as string | null;
    return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
      },
    },
  {
    accessorKey: "animal_weight",
    header: "Weight",
    cell: ({ row }) => <div>{row.getValue("animal_weight")}</div>,
  },
  {
    accessorKey: "drug_name",
    header: "Medicine",
    cell: ({ row }) => <div>{row.getValue("drug_name")}</div>,
  },
  {
    accessorKey: "dosage",
    header: "Dosage",
    cell: ({ row }) => <div>{row.getValue("dosage")}</div>,
  },
  {
    accessorKey: "food_given",
    header: "Food Given",
    cell: ({ row }) => <div>{row.getValue("food_given")}</div>,
  },
  {
    accessorKey: "balance_food_take_out",
    header: "Balance Food Takeout",
    cell: ({ row }) => <div>{row.getValue("balance_food_take_out")}</div>,
  },
  {
    accessorKey: "dopping_consistency",
    header: "Dropping Consistency",
    cell: ({ row }) => <div>{row.getValue("dopping_consistency")}</div>,
  },
  {
    accessorKey: "animal_behavior",
    header: "Behaviour",
    cell: ({ row }) => <div>{row.getValue("animal_behavior")}</div>,
  },
  {
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const animal = row.original
      const queryClient = useQueryClient()
      const deleteMutation = useMutation({

      mutationFn: async () => {
      await fetch(`/api/dailyinspection/${animal.id}`, { method: "DELETE" });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyinspection"] });
      toast.success("Data  deleted successfully!");
    },
  });

 const [editingDaily, setEditingDaily] = React.useState<DailyRecord | null>(null)

    const handleCopyId = () => {
      navigator.clipboard.writeText(animal.id)
    }

    return (
      <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick = {() => setEditingDaily(animal)}>
            Edit Data
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={() =>deleteMutation.mutate()}>
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyId}>
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {editingDaily && (
                      <EditModal
                        Daily={editingDaily}
                        isOpen={true}
                        onOpenChange={(open) => {
                          if (!open) setEditingDaily(null)
                        }}
                        onClose={() => setEditingDaily(null)}
                      />
                    )}
      </div>
    )
  },
}

]

export function AddTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const {data: dailyInspection = [], isLoading} = useQuery({
    queryKey: ["dailyInspection"],
    queryFn: async () => {
      const response = await fetch("/api/dailyinspection");
      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      return result.data as DailyRecord[];
    }
  });

  const table = useReactTable({
    data: dailyInspection??[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Animal Name..."
          value={(table.getColumn("animal_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("animal_id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

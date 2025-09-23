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
export type AnimalRecord = {
  id : string
  animal_id: string
  common_name: string
  date_of_entry: string
  animal_type: string
  sex: string
  cage_number: string
  reason_for_admission: string
  date_of_discharge: string
  createdAt : string
  updatedAt : string
}

// kolom tabel baru
export const columns: ColumnDef<AnimalRecord>[] = [
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
    header: "Animal ID",
    cell: ({ row }) => <div>{row.getValue("animal_id")}</div>,
  },
  {
    accessorKey: "common_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Animal Name
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("common_name")}</div>,
  },
  {
    accessorKey: "date_of_entry",
    header: "Date of Entry",
    cell: ({ row }) => {
    const val = row.getValue("date_of_entry") as string | null;
    return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
      },
  },
  {
    accessorKey: "animal_type",
    header: "Animal Type",
    cell: ({ row }) => <div>{row.getValue("animal_type")}</div>,
  },
  {
    accessorKey: "sex",
    header: "Sex",
    cell: ({ row }) => <div>{row.getValue("sex")}</div>,
  },
  {
    accessorKey: "cage_number",
    header: "Cage Number",
    cell: ({ row }) => <div>{row.getValue("cage_number")}</div>,
  },
  {
    accessorKey: "reason_for_admission",
    header: "Reason of Admission",
    cell: ({ row }) => <div>{row.getValue("reason_for_admission")}</div>,
  },
  {
    accessorKey: "date_of_discharge",
    header: "Date of Discharge",
    cell: ({ row }) => {const val = row.getValue("date_of_discharge") as string | null;
    return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
      }
    },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const animal = row.original
      const queryClient = useQueryClient();
      const deleteMutation = useMutation({
    mutationFn: async () => {
      await fetch(`/api/animals/${animal.id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["animals"] });
      toast.success("Data  deleted successfully!");
    },
    
  });
   const [editingAnimal, setEditingAnimal] = React.useState<AnimalRecord | null>(null)

      const handleEdit = () => {
        // logika edit data di sini, misalnya buka modal edit
        console.log("Edit data:", animal)
      }

      const handleDelete = () => {
        // logika hapus data di sini
        console.log("Delete data:", animal)
      }

      const handleCopyId = () => {
        navigator.clipboard.writeText(animal.animal_id)
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
            <DropdownMenuItem onClick={() => setEditingAnimal(animal)}>
              Edit Data
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => deleteMutation.mutate()}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(animal.animal_id)}>
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {editingAnimal && (
        <EditModal
          animal={editingAnimal}
          isOpen={true}
          onOpenChange={(open) => {
            if (!open) setEditingAnimal(null)
          }}
          onClose={() => setEditingAnimal(null)}
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

const { data: animals = []} = useQuery({
    queryKey: ["animals"],
    queryFn: async () => {
      try {
      const res = await fetch("/api/animals");
      if (!res.ok) throw new Error("Failed to fetch animals");
      const result = await res.json();
      return result?.data ?? [];
    } catch (err) {
      console.error("Error fetching animals:", err);
      return []; // fallback agar query selalu return array
    }
    },
  });

  if (animals === undefined) {
    return <div>Loading...</div>;
  }


  const table = useReactTable({
    data:animals ?? [],
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter Animal Name..."
          value={(table.getColumn("common_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("common_name")?.setFilterValue(event.target.value)
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

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

// tipe data baru
export type LabRecord = {
  id:string
  test_type:string
  diagnosis:string
  attachment_file:string | null
  test_date:string
  description:string
  drug_name:string
  animal_id:string 
}


// definisi kolom tabel
export const columns: ColumnDef<LabRecord>[] = [
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
   accessorKey: "attachment_file",
  header: "Attachment",
  cell: ({ row }) => {
    const raw = row.getValue("attachment_file");
    if (!raw) return <span className="text-muted-foreground">No file</span>;

    const file = typeof raw === "string" ? raw : String(raw);
    const last = file.lastIndexOf("/");
    const filename = last >= 0 ? file.substring(last + 1) : file;

    return (
      <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
        {decodeURIComponent(filename)}
      </a>
    );
    },
  },
  {
    accessorKey: "animal_id",
    header: "Animal ID",
    cell: ({ row }) => <div>{row.getValue("animal_id")}</div>,
  },
  {
    accessorKey: "test_type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Test Type
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("test_type")}</div>,
  },
  {
    accessorKey: "test_date",
    header: "Test Date",
    cell: ({ row }) => {
    const val = row.getValue("test_date") as string | null;
    return <div>{val ? new Date(val).toLocaleDateString() : "-"}</div>;
      },
  },
  {
    accessorKey: "drug_name",
    header: "Drug Name",
    cell: ({ row }) => <div>{row.getValue("drug_name")}</div>,
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
    cell: ({ row }) => <div>{row.getValue("diagnosis")}</div>,
  },
  {
    accessorKey: "description",
    header: "Descriptions",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const animal = row.original
      const queryClient = useQueryClient()
      const deleteMutation = useMutation({

      mutationFn: async () => {
      await fetch(`/api/laboratory/${animal.id}`, { method: "DELETE" });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["laboratory"] });
    },
  });
  
     
      const [editingLab, setEditingLab] = React.useState<LabRecord | null>(null)

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
            <DropdownMenuItem onClick={() => setEditingLab(animal)}>
              Edit Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() =>deleteMutation.mutate()}>
              Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(animal.animal_id)}>
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {editingLab && (
                <EditModal
                  Lab={editingLab}
                  isOpen={true}
                  onOpenChange={(open) => {
                    if (!open) setEditingLab(null)
                  }}
                  onClose={() => setEditingLab(null)}
                />
              )}
        </div>
      )
    },
  }

]

export function AddTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const { data: laboratorium = [], isLoading }= useQuery({
    queryKey: ["laboratorium"],
    queryFn: async () => {
      const response = await fetch("/api/laboratory");
      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      return result.data as LabRecord[];
    },
  });



  const table = useReactTable({
    data: laboratorium ?? [],
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
          placeholder="Filter animal_id..."
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

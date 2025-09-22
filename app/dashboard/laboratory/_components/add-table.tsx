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
export type LabRecord = {
  id: string
  test_type: string
  diagnosis: string
  attachment_file: string | null
  test_date: string
  description: string
  drug_name: string
  animal_id: string 
}

// Utility function untuk menghapus file dari UploadThing
const deleteUploadThingFile = async (fileUrl: string): Promise<boolean> => {
  try {
    // Ekstrak file key dari URL UploadThing
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const fileKey = pathParts[pathParts.length - 1];
    
    if (!fileKey) {
      throw new Error("Invalid file URL - cannot extract file key");
    }

    const response = await fetch('/api/delete-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileKey }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete file from UploadThing');
    }

    return true;
  } catch (error) {
    console.error('Error deleting file from UploadThing:', error);
    throw error;
  }
};

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
        <a 
          href={file} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 underline hover:text-blue-800"
        >
          {decodeURIComponent(filename)}
        </a>
      );
    },
  },
  {
    accessorKey: "animal_id",
    header: "Animal ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("animal_id")}</div>,
  },
  {
    accessorKey: "test_type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Test Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("test_type")}</div>,
  },
  {
    accessorKey: "test_date",
    header: "Test Date",
    cell: ({ row }) => {
      const val = row.getValue("test_date") as string | null;
      return <div>{val ? new Date(val).toLocaleDateString('id-ID') : "-"}</div>;
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
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.getValue("description")}>
        {row.getValue("description")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const animal = row.original;
      const queryClient = useQueryClient();
      const [editingLab, setEditingLab] = React.useState<LabRecord | null>(null);

      const deleteMutation = useMutation({
        mutationFn: async () => {
          // Konfirmasi sebelum menghapus
          const confirmed = window.confirm(
            "Are you sure you want to delete this record and its associated file?"
          );
          
          if (!confirmed) {
            throw new Error("Deletion cancelled");
          }
          
          try {
            // Hapus file dari UploadThing jika ada dan berasal dari UploadThing
            if (animal.attachment_file && animal.attachment_file.includes('utfs.io')) {
              await deleteUploadThingFile(animal.attachment_file);
            }
            
            // Hapus data dari database
            const response = await fetch(`/api/laboratory/${animal.id}`, { 
              method: "DELETE" 
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Failed to delete record from database");
            }
          } catch (error) {
            console.error("Error during deletion:", error);
            throw error;
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["laboratory"] });
          toast.success("Data and file deleted successfully!");
        },
        onError: (error: Error) => {
          toast.error(error.message || "Failed to delete data");
        },
      });

      const handleDelete = () => {
        deleteMutation.mutate();
      };

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => setEditingLab(animal)}
                className="cursor-pointer"
              >
                Edit Data
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="cursor-pointer text-red-600 focus:text-red-600"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigator.clipboard.writeText(animal.animal_id)}
                className="cursor-pointer"
              >
                Copy Animal ID
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {editingLab && (
            <EditModal
              Lab={editingLab}
              isOpen={true}
              onOpenChange={(open) => {
                if (!open) setEditingLab(null);
              }}
              onClose={() => setEditingLab(null)}
            />
          )}
        </div>
      );
    },
  },
];

export function AddTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: laboratorium = [], isLoading, error } = useQuery({
    queryKey: ["laboratory"], // Diperbaiki dari "laboratorium" menjadi "laboratory"
    queryFn: async () => {
      const response = await fetch("/api/laboratory");
      if (!response.ok) throw new Error('Network error');
      const result = await response.json();
      return result.data as LabRecord[];
    },
  });

  const table = useReactTable({
    data: laboratorium,
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
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading data</div>
      </div>
    );
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
              Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                );
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
                  );
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
                  No results found.
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
  );
}
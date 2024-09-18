import { useState } from "react";
import {
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  MagnifyingGlass,
} from "@phosphor-icons/react/dist/ssr";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hidePagination?: boolean;
  hideSearch?: boolean;
  onRowClick?: (row: TData) => void;
  pageSizeForPagination?: number;
  isLoading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  hidePagination = false,
  hideSearch,
  pageSizeForPagination = 20,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: pageSizeForPagination,
      },
    },
  });

  return (
    <div>
      <div
        className={`items-center gap-4 mb-4 ${hideSearch ? "hidden" : "flex"}`}
      >
        <Input
          startIcon={
            <MagnifyingGlass
              weight="bold"
              className="h-4 w-4 text-neutrals-8"
            />
          }
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="w-full bg-white/65 rounded-lg"
        />
      </div>
      <div className="border border-neutrals-4 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/50">
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
          <TableBody className="bg-white">
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center font-medium text-md text-neutrals-8"
                >
                  <div className="flex items-center justify-center space-x-2 italic">
                    <Spinner className="w-6 h-6 mr-2" />
                    <p>Fetching ...</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows?.length > 0 &&
              !isLoading &&
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick && onRowClick(row.original)}
                  className="hover:bg-muted/50 hover:cursor-pointer"
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
              ))}
            {!table.getRowModel().rows?.length && !isLoading && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-12 text-center font-medium text-md text-neutrals-8 italic"
                >
                  None in the pipeline!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div
        className={`flex items-center justify-end space-x-2 py-4 ${
          hidePagination ? "hidden" : "block"
        }`}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="flex items-center"
        >
          <ArrowLeft weight="bold" className="mr-2" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="flex items-center"
        >
          Next
          <ArrowRight weight="bold" className="ml-2" />
        </Button>
      </div>
    </div>
  );
}

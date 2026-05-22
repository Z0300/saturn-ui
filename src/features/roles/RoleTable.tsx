import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Loader2Icon } from "lucide-react"
import type { Role } from "@/types"
import type { PaginatedResponse } from "@/types"
import { TablePagination } from "#/components/pagination"

interface RolesTableProps {
  data: PaginatedResponse<Role> | undefined
  columns: ColumnDef<Role>[]
  isLoading: boolean
  page: number
  pageSize: number
  onPageChange: (page: number, size?: number) => void
}

export function RolesTable({
  data,
  columns,
  isLoading,
  page,
  pageSize,
  onPageChange,
}: RolesTableProps) {
  const roles = data?.data ?? []
  const totalPages = data?.meta?.totalPages ?? 0

  const table = useReactTable({
    data: roles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    state: {
      pagination: { pageIndex: page, pageSize },
    },
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex: page, pageSize })
        : updater
      onPageChange(next.pageIndex, next.pageSize)
    },
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <Loader2Icon className="h-4 w-4 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && roles.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  No roles found
                </TableCell>
              </TableRow>
            )}
            {!isLoading && table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading &&
        (data?.meta?.totalElements ?? 0) > pageSize && (
          <TablePagination
            table={table}
            page={page}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        )}
    </div>
  )
}
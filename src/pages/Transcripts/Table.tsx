import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Transcript } from "@/types/Transcript"
import { createContext, useContext, useState } from 'react'

interface TableContextProps {
    handleDownload: (transcript: Transcript) => void
    handleDelete: (id: string) => void
    downloadLoadingId: string | null

}

const TableContext = createContext<TableContextProps>({
    downloadLoadingId: null,
    handleDownload: () => { },
    handleDelete: async () => { }
});

export const useTableContext = () => useContext(TableContext);

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    handleDownload: (transcript: Transcript) => void
    handleDelete: (id: string) => void
    downloadLoadingId: string | null
}


export function TranscriptTable<TData, TValue>({
    columns,
    data,
    handleDownload,
    handleDelete,
    downloadLoadingId,

}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "createdAt",
            desc: true,
        },
    ])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data,
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
        manualPagination: false
    })


    return (
        <TableContext.Provider value={{ downloadLoadingId, handleDownload, handleDelete }}>
            <div className="w-11/12 mx-auto">

                <div className="flex items-center justify-between py-4 gap-4">
                    <Input
                        placeholder="Filter by Student..."
                        value={(table.getColumn("student")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("student")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />

                </div>

                <div className="rounded-md border">
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
                                        className="h-24 text-center text-stone-950 dark:text-stone-50"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <div className="flex-1 text-sm text-muted-foreground text-stone-950 dark:text-stone-50">
                        {table.getFilteredRowModel().rows.length} of{" "}
                        {data.length} row(s) shown.
                    </div>

                    <div className="flex items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium  text-stone-950 dark:text-stone-50">Rows</p>
                            <Select
                                value={`${table.getState().pagination.pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value))
                                }}
                            >
                                <SelectTrigger className="h-8 w-[70px]">
                                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[1, 10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            <p className="text-xs inline dark:text-stone-50 ">Page: {table.options.state.pagination?.pageIndex ? table.options.state.pagination?.pageIndex : 1} of {table.getPageCount()}</p>
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
            </div>
        </TableContext.Provider>
    )
}
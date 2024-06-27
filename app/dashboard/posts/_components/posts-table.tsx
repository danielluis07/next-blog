"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
  Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConfirm } from "@/hooks/use-confirm";
import { LiaTrashAltSolid } from "react-icons/lia";
import { cn } from "@/lib/utils";

type PostsDataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (rows: Row<TData>[]) => void;
  disabled: boolean;
  searchKey: string;
};

export function PostsDataTable<TData, TValue>({
  columns,
  data,
  onDelete,
  searchKey,
}: PostsDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [ConfirmDialog, confirm] = useConfirm(
    "Tem certeza?",
    "Você está prestes a deletar os posts selecionados"
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <ConfirmDialog />
      <div className="relative flex items-center justify-between py-4">
        <Input
          placeholder="Procurar..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-1/2"
        />
        <div className="absolute top-0 right-0">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="destructive"
              className="rounded-full size-12 p-0"
              onClick={async () => {
                const ok = await confirm();

                if (ok) {
                  onDelete(table.getFilteredSelectedRowModel().rows);
                  table.resetRowSelection();
                }
              }}>
              <LiaTrashAltSolid className="text-xl" />
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table className="w-[800px] md:w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="font-extrabold text-center">
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
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    console.log(cell);
                    let cellStyle = "";

                    console.log(cell.column.id);

                    if (cell.column.id === "title") {
                      cellStyle = "w-[350px]";
                    }

                    if (cell.column.id === "post_isPublished") {
                      if (cell.getValue() === "Sim") {
                        cellStyle =
                          "flex justify-center w-10 py-1 ml-4 rounded-lg bg-green-200 text-green-700 font-bold"; // Style for 'Sim'
                      } else if (cell.getValue() === "Não") {
                        cellStyle =
                          "flex justify-center w-10 py-1 ml-4 rounded-lg bg-red-200 text-red-700 font-bold"; // Style for 'Não'
                      }
                    }

                    if (cell.column.id === "post_isFeatured") {
                      if (cell.getValue() === "Sim") {
                        cellStyle =
                          "flex justify-center w-10 py-1 ml-4 rounded-lg bg-blue-200 text-blue-500 font-bold"; // Style for 'Sim'
                      } else if (cell.getValue() === "Não") {
                        cellStyle =
                          "flex justify-center w-10 py-1 ml-4 rounded-lg bg-gray-200 text-gray-700 font-bold"; // Style for 'Não'
                      }
                    }

                    return (
                      <TableCell key={cell.id}>
                        <div className={cn(cellStyle)}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 text-sm text-muted-foreground mt-2">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} colunas(s) selecionadas.
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Próxima
        </Button>
      </div>
    </>
  );
}

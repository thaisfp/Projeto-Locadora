"use client";

import * as React from "react";
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
  useReactTable,
} from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { Dependente, DependentesArray } from "@/model/dependente";
import { SocioArray } from "@/model/socio";
import { FormNovoCliente } from "../../novoCliente/components/dialog-form-cliente";
import { FormSocio } from "../../novoCliente/components/dialog-form-socio-dependentes";
import { AlertDialogAtivoCliente } from "./dialog-ativo";
import { DialogDeletarCliente } from "./dialog-remover-cliente";

export const columns: ColumnDef<Dependente>[] = [
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
    accessorKey: "numInscricao",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full gap-2"
      >
        Número de Inscrição
        <ArrowUpDown className="w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="pl-3 flex justify-center">
        {row.getValue("numInscricao")}
      </div>
    ),
  },
  {
    accessorKey: "nome",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full gap-2"
      >
        Nome do Cliente
        <ArrowUpDown className="w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="pl-3 flex justify-center">{row.getValue("nome")}</div>
    ),
  },
  {
    accessorKey: "dtNascimento",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="w-full gap-2"
        >
          Data de Nascimento
          <ArrowUpDown className="w-4"></ArrowUpDown>
        </Button>
      );
    },
    cell: ({ row }) => {
      const data = new Date(row.original.dtNascimento);
      return (
        <div className="capitalize pl-3 flex justify-center ">
          {data.toLocaleDateString("pt-BR", {
            timeZone: "UTC",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "ativo",
    header: ({ column }) => {
      return (
        <div className="flex justify-center w-20 ">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex justify-center items-center ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div
                data-tip={row.original.estahAtivo ? "Ativo" : "Inativo"}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "100%",
                  backgroundColor: row.original.estahAtivo
                    ? "#26B547"
                    : "#FF0000",
                }}
              ></div>
            </TooltipTrigger>
            <TooltipContent>
              {row.original.estahAtivo ? "Ativo" : "Inativo"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
  {
    accessorKey: "acoes",
    header: ({}) => {
      return (
        <Button variant="ghost" className="w-full">
          Ações
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex gap-5 justify-center ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <AlertDialogAtivoCliente
                cliente={row.original}
                ativo={row.original.estahAtivo!}
              />
            </TooltipTrigger>
            <TooltipContent>
              {row.original.estahAtivo ? "Desativar" : "Ativar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FormNovoCliente cliente={row.original}></FormNovoCliente>
            </TooltipTrigger>
            <TooltipContent>Editar Cliente</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FormSocio params={{ clienteObj: row.original }}></FormSocio>
            </TooltipTrigger>
            <TooltipContent>Add/Editar dependentes</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <DialogDeletarCliente cliente={ row.original }></DialogDeletarCliente>
            </TooltipTrigger>
            <TooltipContent>Remover Cliente</TooltipContent>
          </Tooltip>
        </TooltipProvider>
              </div>
    ),
  },
];

interface PropsCliente {
  dependentes: DependentesArray;
  socios: SocioArray;
}

export function DataTableCliente({ dependentes }: PropsCliente) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: dependentes ?? [],
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("nome")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("nome")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
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
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
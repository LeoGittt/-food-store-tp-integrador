import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/Button";

interface TablaProps<T> {
  datos: T[];
  columnas: ColumnDef<T>[];
}

export function Tabla<T>({ datos, columnas }: TablaProps<T>) {
  const tabla = useReactTable({
    data: datos,
    columns: columnas,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div>
      <table className="w-full border border-gray-300">
        <thead>
          {tabla.getHeaderGroups().map((grupo) => (
            <tr key={grupo.id} className="bg-gray-100">
              {grupo.headers.map((header) => (
                <th key={header.id} className="text-left p-2 border-b border-gray-300">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tabla.getRowModel().rows.map((fila) => (
            <tr key={fila.id} className="border-b border-gray-200">
              {fila.getVisibleCells().map((celda) => (
                <td key={celda.id} className="p-2">
                  {flexRender(celda.column.columnDef.cell, celda.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {tabla.getPageCount() > 1 && (
        <div className="flex items-center gap-3 mt-4">
          <Button disabled={!tabla.getCanPreviousPage()} onClick={() => tabla.previousPage()}>
            Anterior
          </Button>
          <span>
            Página {tabla.getState().pagination.pageIndex + 1} de {tabla.getPageCount()}
          </span>
          <Button disabled={!tabla.getCanNextPage()} onClick={() => tabla.nextPage()}>
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}

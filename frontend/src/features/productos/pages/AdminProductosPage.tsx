import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useEliminarProducto, useProductos } from "../hooks/useProductos";
import { ProductoForm } from "../components/ProductoForm";
import { StockForm } from "../components/StockForm";
import type { Producto } from "../types";
import { Tabla } from "../../../shared/components/Tabla";
import { Modal } from "../../../shared/ui/Modal";
import { Button } from "../../../shared/ui/Button";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";

export default function AdminProductosPage() {
  const { data, isLoading, isError } = useProductos({ skip: 0, limit: 100 });
  const eliminar = useEliminarProducto();
  const [formularioAbierto, setFormularioAbierto] = useState(false);
  const [stockAbierto, setStockAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);

  function abrirFormulario(producto: Producto | null) {
    setSeleccionado(producto);
    setFormularioAbierto(true);
  }

  function abrirStock(producto: Producto) {
    setSeleccionado(producto);
    setStockAbierto(true);
  }

  const columnas: ColumnDef<Producto>[] = [
    { accessorKey: "nombre", header: "Nombre" },
    { id: "categoria", header: "Categoría", accessorFn: (producto) => producto.categoria.nombre },
    { id: "precio", header: "Precio", cell: ({ row }) => `$${row.original.precio_base.toFixed(2)}` },
    { accessorKey: "stock", header: "Stock" },
    { id: "disponible", header: "Disponible", cell: ({ row }) => (row.original.disponible ? "Sí" : "No") },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button onClick={() => abrirFormulario(row.original)}>Editar</Button>
          <Button onClick={() => abrirStock(row.original)}>Stock</Button>
          <Button onClick={() => eliminar.mutate(row.original.id)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Productos</h1>
        <Button onClick={() => abrirFormulario(null)}>Nuevo producto</Button>
      </div>
      {isLoading && <p>Cargando...</p>}
      {isError && <EstadoError mensaje="No se pudieron cargar los productos" />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No hay productos" />}
      {data && data.items.length > 0 && <Tabla datos={data.items} columnas={columnas} />}
      <Modal
        abierto={formularioAbierto}
        titulo={seleccionado ? "Editar producto" : "Nuevo producto"}
        onCerrar={() => setFormularioAbierto(false)}
      >
        <ProductoForm producto={seleccionado} onGuardado={() => setFormularioAbierto(false)} />
      </Modal>
      <Modal abierto={stockAbierto} titulo="Cambiar stock" onCerrar={() => setStockAbierto(false)}>
        {seleccionado && <StockForm producto={seleccionado} onGuardado={() => setStockAbierto(false)} />}
      </Modal>
    </div>
  );
}

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useCategorias, useEliminarCategoria } from "../hooks/useCategorias";
import { CategoriaForm } from "../components/CategoriaForm";
import type { Categoria } from "../types";
import { Tabla } from "../../../shared/components/Tabla";
import { Modal } from "../../../shared/ui/Modal";
import { Button } from "../../../shared/ui/Button";
import { EstadoError } from "../../../shared/components/EstadoError";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";

export default function AdminCategoriasPage() {
  const { data, isLoading, isError } = useCategorias();
  const eliminar = useEliminarCategoria();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [seleccionada, setSeleccionada] = useState<Categoria | null>(null);

  function abrirFormulario(categoria: Categoria | null) {
    setSeleccionada(categoria);
    setModalAbierto(true);
  }

  const columnas: ColumnDef<Categoria>[] = [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button onClick={() => abrirFormulario(row.original)}>Editar</Button>
          <Button onClick={() => eliminar.mutate(row.original.id)}>Eliminar</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Categorías</h1>
        <Button onClick={() => abrirFormulario(null)}>Nueva categoría</Button>
      </div>
      {isLoading && <p>Cargando...</p>}
      {isError && <EstadoError mensaje="No se pudieron cargar las categorías" />}
      {data && data.length === 0 && <EstadoVacio mensaje="No hay categorías" />}
      {data && data.length > 0 && <Tabla datos={data} columnas={columnas} />}
      <Modal
        abierto={modalAbierto}
        titulo={seleccionada ? "Editar categoría" : "Nueva categoría"}
        onCerrar={() => setModalAbierto(false)}
      >
        <CategoriaForm categoria={seleccionada} onGuardado={() => setModalAbierto(false)} />
      </Modal>
    </div>
  );
}

import type { ColumnDef } from "@tanstack/react-table";
import { useActivarUsuario, useDesactivarUsuario, useUsuarios } from "../hooks/useUsuarios";
import { useAuthStore } from "../../../store/authStore";
import type { Usuario } from "../../auth/types";
import { Tabla } from "../../../shared/components/Tabla";
import { Button } from "../../../shared/ui/Button";
import { EstadoError } from "../../../shared/components/EstadoError";
import { handleApiError } from "../../../shared/api/handleApiError";

export default function AdminUsuariosPage() {
  const usuarioActual = useAuthStore((state) => state.usuario);
  const { data, isLoading, isError } = useUsuarios();
  const activar = useActivarUsuario();
  const desactivar = useDesactivarUsuario();

  const columnas: ColumnDef<Usuario>[] = [
    { accessorKey: "username", header: "Usuario" },
    { accessorKey: "full_name", header: "Nombre" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Rol" },
    {
      id: "estado",
      header: "Estado",
      cell: ({ row }) => (row.original.disabled ? "Desactivado" : "Activo"),
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        const usuario = row.original;
        if (usuario.disabled) {
          return <Button onClick={() => activar.mutate(usuario.id)}>Activar</Button>;
        }
        if (usuario.id === usuarioActual?.id) {
          return null;
        }
        return <Button onClick={() => desactivar.mutate(usuario.id)}>Desactivar</Button>;
      },
    },
  ];

  const error = activar.error ?? desactivar.error;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>
      {error && <p className="text-red-600 mb-3">{handleApiError(error)}</p>}
      {isLoading && <p>Cargando...</p>}
      {isError && <EstadoError mensaje="No se pudieron cargar los usuarios" />}
      {data && <Tabla datos={data} columnas={columnas} />}
    </div>
  );
}

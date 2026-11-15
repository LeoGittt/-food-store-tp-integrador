import { useState } from "react";
import { usePedidos, useCambiarEstadoPedido } from "../hooks/usePedidos";
import { DetallePedidoView } from "../components/DetallePedidoView";
import type { EstadoPedido, Pedido } from "../types";
import { BadgeEstado } from "../../../shared/ui/BadgeEstado";
import { Button } from "../../../shared/ui/Button";
import { Modal } from "../../../shared/ui/Modal";
import { Paginacion } from "../../../shared/components/Paginacion";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { EstadoError } from "../../../shared/components/EstadoError";
import { handleApiError } from "../../../shared/api/handleApiError";

const LIMITE = 10;

const TRANSICIONES: Record<EstadoPedido, EstadoPedido[]> = {
  PENDIENTE: ["EN_PREPARACION", "CANCELADO"],
  EN_PREPARACION: ["ENTREGADO", "CANCELADO"],
  ENTREGADO: [],
  CANCELADO: [],
};

const TEXTO_BOTON: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "Preparar",
  ENTREGADO: "Entregar",
  CANCELADO: "Cancelar",
};

export default function AdminPedidosPage() {
  const [pagina, setPagina] = useState(0);
  const [estado, setEstado] = useState<EstadoPedido | undefined>(undefined);
  const [seleccionado, setSeleccionado] = useState<Pedido | null>(null);
  const { data, isLoading, isError } = usePedidos({ skip: pagina * LIMITE, limit: LIMITE, estado });
  const cambiarEstado = useCambiarEstadoPedido();

  const totalPaginas = data ? Math.ceil(data.total / LIMITE) : 0;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Pedidos</h1>
      <select
        className="border border-gray-400 rounded px-2 py-1 mb-4"
        value={estado ?? ""}
        onChange={(e) => {
          setEstado(e.target.value ? (e.target.value as EstadoPedido) : undefined);
          setPagina(0);
        }}
      >
        <option value="">Todos los estados</option>
        <option value="PENDIENTE">Pendiente</option>
        <option value="EN_PREPARACION">En preparación</option>
        <option value="ENTREGADO">Entregado</option>
        <option value="CANCELADO">Cancelado</option>
      </select>
      {cambiarEstado.isError && <p className="text-red-600 mb-3">{handleApiError(cambiarEstado.error)}</p>}
      {isLoading && <p>Cargando...</p>}
      {isError && <EstadoError mensaje="No se pudieron cargar los pedidos" />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No hay pedidos" />}
      {data && data.items.length > 0 && (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-2">N°</th>
              <th className="text-left p-2">Usuario</th>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((pedido) => (
              <tr key={pedido.id} className="border-t border-gray-200">
                <td className="p-2">{pedido.id}</td>
                <td className="p-2">{pedido.usuario_id}</td>
                <td className="p-2">{new Date(pedido.created_at).toLocaleString()}</td>
                <td className="p-2">${pedido.total.toFixed(2)}</td>
                <td className="p-2">
                  <BadgeEstado estado={pedido.estado} />
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button onClick={() => setSeleccionado(pedido)}>Ver</Button>
                    {TRANSICIONES[pedido.estado].map((siguiente) => (
                      <Button key={siguiente} onClick={() => cambiarEstado.mutate({ id: pedido.id, estado: siguiente })}>
                        {TEXTO_BOTON[siguiente]}
                      </Button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
      <Modal abierto={seleccionado !== null} titulo={`Pedido N° ${seleccionado?.id}`} onCerrar={() => setSeleccionado(null)}>
        {seleccionado && <DetallePedidoView pedido={seleccionado} />}
      </Modal>
    </div>
  );
}

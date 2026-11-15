import type { Pedido } from "../types";
import { BadgeEstado } from "../../../shared/ui/BadgeEstado";

interface DetallePedidoViewProps {
  pedido: Pedido;
}

export function DetallePedidoView({ pedido }: DetallePedidoViewProps) {
  return (
    <div>
      <p className="mb-1">
        Estado: <BadgeEstado estado={pedido.estado} />
      </p>
      <p className="mb-1">Fecha: {new Date(pedido.created_at).toLocaleString()}</p>
      <p className="mb-1">Dirección: {pedido.direccion_entrega}</p>
      <p className="mb-1">Forma de pago: {pedido.forma_pago}</p>
      {pedido.notas && <p className="mb-1">Notas: {pedido.notas}</p>}
      <table className="w-full mt-3 border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Producto</th>
            <th className="text-left p-2">Precio</th>
            <th className="text-left p-2">Cantidad</th>
            <th className="text-left p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.producto_id} className="border-t border-gray-200">
              <td className="p-2">{item.nombre_producto}</td>
              <td className="p-2">${item.precio_unitario.toFixed(2)}</td>
              <td className="p-2">{item.cantidad}</td>
              <td className="p-2">${item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-bold mt-3">Total: ${pedido.total.toFixed(2)}</p>
    </div>
  );
}

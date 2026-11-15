import { Link } from "react-router-dom";
import { useCartStore } from "../../../store/cartStore";
import { Button } from "../../../shared/ui/Button";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";

export default function CarritoPage() {
  const items = useCartStore((state) => state.items);
  const quitar = useCartStore((state) => state.quitar);
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const vaciar = useCartStore((state) => state.vaciar);
  const total = useCartStore((state) => state.total);

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-xl font-bold mb-4">Carrito</h1>
        <EstadoVacio mensaje="El carrito está vacío" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Carrito</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2">Producto</th>
            <th className="text-left p-2">Precio</th>
            <th className="text-left p-2">Cantidad</th>
            <th className="text-left p-2">Subtotal</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.producto_id} className="border-t border-gray-200">
              <td className="p-2">{item.nombre}</td>
              <td className="p-2">${item.precio_unitario.toFixed(2)}</td>
              <td className="p-2">
                <input
                  type="number"
                  min={1}
                  className="border border-gray-400 rounded px-2 w-20"
                  value={item.cantidad}
                  onChange={(e) => cambiarCantidad(item.producto_id, Number(e.target.value))}
                />
              </td>
              <td className="p-2">${(item.precio_unitario * item.cantidad).toFixed(2)}</td>
              <td className="p-2">
                <Button onClick={() => quitar(item.producto_id)}>Quitar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="font-bold text-lg mt-4">Total: ${total().toFixed(2)}</p>
      <div className="flex gap-3 mt-4">
        <Button onClick={vaciar}>Vaciar carrito</Button>
        <Link to="/checkout" className="border border-gray-700 rounded px-3 py-1 hover:bg-gray-100">
          Continuar con la compra
        </Link>
      </div>
    </div>
  );
}

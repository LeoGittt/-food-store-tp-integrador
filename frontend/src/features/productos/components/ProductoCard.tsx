import type { Producto } from "../types";
import { useCartStore } from "../../../store/cartStore";
import { Card } from "../../../shared/ui/Card";
import { Button } from "../../../shared/ui/Button";

interface ProductoCardProps {
  producto: Producto;
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const agregar = useCartStore((state) => state.agregar);
  const sePuedeComprar = producto.disponible && producto.stock > 0;

  return (
    <Card>
      {producto.imagen_url && (
        <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-40 object-cover mb-2" />
      )}
      <h3 className="font-bold">{producto.nombre}</h3>
      <p className="text-sm text-gray-600">{producto.categoria.nombre}</p>
      <p className="text-sm">{producto.descripcion}</p>
      <p className="font-bold mt-2">${producto.precio_base.toFixed(2)}</p>
      <p className="text-sm mb-2">Stock: {producto.stock}</p>
      <Button
        disabled={!sePuedeComprar}
        onClick={() =>
          agregar({ producto_id: producto.id, nombre: producto.nombre, precio_unitario: producto.precio_base })
        }
      >
        {sePuedeComprar ? "Agregar al carrito" : producto.stock === 0 ? "Sin stock" : "No disponible"}
      </Button>
    </Card>
  );
}

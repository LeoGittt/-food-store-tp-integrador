import { Navigate, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../store/cartStore";
import { useCrearPedido } from "../hooks/usePedidos";
import { CheckoutForm } from "../components/CheckoutForm";
import type { DatosCheckout } from "../components/CheckoutForm";
import { handleApiError } from "../../../shared/api/handleApiError";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const vaciar = useCartStore((state) => state.vaciar);
  const crearPedido = useCrearPedido();
  const navigate = useNavigate();

  if (items.length === 0 && !crearPedido.isSuccess) {
    return <Navigate to="/carrito" replace />;
  }

  function confirmar(datos: DatosCheckout) {
    crearPedido.mutate(
      {
        items: items.map((item) => ({ producto_id: item.producto_id, cantidad: item.cantidad })),
        forma_pago: datos.forma_pago,
        direccion_entrega: datos.direccion_entrega,
        notas: datos.notas || null,
      },
      {
        onSuccess: () => {
          vaciar();
          navigate("/mis-pedidos");
        },
      },
    );
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold mb-4">Confirmar pedido</h1>
      <p className="mb-4">
        {items.length} productos. Total: ${total().toFixed(2)}
      </p>
      {crearPedido.isError && <p className="text-red-600 mb-3">{handleApiError(crearPedido.error)}</p>}
      <CheckoutForm enviando={crearPedido.isPending} onConfirmar={confirmar} />
    </div>
  );
}

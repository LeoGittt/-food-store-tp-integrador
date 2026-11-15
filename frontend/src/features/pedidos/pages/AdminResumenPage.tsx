import { useResumenPedidos } from "../hooks/usePedidos";
import { TarjetaResumen } from "../components/TarjetaResumen";
import { EstadoError } from "../../../shared/components/EstadoError";

export default function AdminResumenPage() {
  const { data, isLoading, isError } = useResumenPedidos();

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Resumen</h1>
      {isLoading && <p>Cargando...</p>}
      {isError && <EstadoError mensaje="No se pudo cargar el resumen" />}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <TarjetaResumen titulo="Pendientes" valor={data.pendientes} />
          <TarjetaResumen titulo="En preparación" valor={data.en_preparacion} />
          <TarjetaResumen titulo="Entregados" valor={data.entregados} />
          <TarjetaResumen titulo="Cancelados" valor={data.cancelados} />
          <TarjetaResumen titulo="Pedidos de hoy" valor={data.pedidos_hoy} />
          <TarjetaResumen titulo="Ingresos entregados" valor={`$${data.ingresos_entregados.toFixed(2)}`} />
        </div>
      )}
    </div>
  );
}

import type { EstadoPedido } from "../../features/pedidos/types";

const estilos: Record<EstadoPedido, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  EN_PREPARACION: "bg-blue-100 text-blue-800",
  ENTREGADO: "bg-green-100 text-green-800",
  CANCELADO: "bg-red-100 text-red-800",
};

const textos: Record<EstadoPedido, string> = {
  PENDIENTE: "Pendiente",
  EN_PREPARACION: "En preparación",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

interface BadgeEstadoProps {
  estado: EstadoPedido;
}

export function BadgeEstado({ estado }: BadgeEstadoProps) {
  return <span className={`rounded px-2 text-sm ${estilos[estado]}`}>{textos[estado]}</span>;
}

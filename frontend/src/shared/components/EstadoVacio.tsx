interface EstadoVacioProps {
  mensaje: string;
}

export function EstadoVacio({ mensaje }: EstadoVacioProps) {
  return <p className="text-gray-600 py-8 text-center">{mensaje}</p>;
}

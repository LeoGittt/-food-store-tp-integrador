interface EstadoErrorProps {
  mensaje: string;
}

export function EstadoError({ mensaje }: EstadoErrorProps) {
  return <p className="text-red-600 py-8 text-center">{mensaje}</p>;
}

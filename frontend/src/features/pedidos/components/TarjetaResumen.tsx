import { Card } from "../../../shared/ui/Card";

interface TarjetaResumenProps {
  titulo: string;
  valor: string | number;
}

export function TarjetaResumen({ titulo, valor }: TarjetaResumenProps) {
  return (
    <Card>
      <p className="text-sm text-gray-600">{titulo}</p>
      <p className="text-2xl font-bold">{valor}</p>
    </Card>
  );
}

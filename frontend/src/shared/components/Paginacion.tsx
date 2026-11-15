import { Button } from "../ui/Button";

interface PaginacionProps {
  pagina: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
}

export function Paginacion({ pagina, totalPaginas, onCambiar }: PaginacionProps) {
  if (totalPaginas <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 mt-4">
      <Button disabled={pagina === 0} onClick={() => onCambiar(pagina - 1)}>
        Anterior
      </Button>
      <span>
        Página {pagina + 1} de {totalPaginas}
      </span>
      <Button disabled={pagina + 1 >= totalPaginas} onClick={() => onCambiar(pagina + 1)}>
        Siguiente
      </Button>
    </div>
  );
}

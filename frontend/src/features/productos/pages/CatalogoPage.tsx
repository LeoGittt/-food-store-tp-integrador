import { useState } from "react";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { ProductoCard } from "../components/ProductoCard";
import { Skeleton } from "../../../shared/components/Skeleton";
import { EstadoVacio } from "../../../shared/components/EstadoVacio";
import { EstadoError } from "../../../shared/components/EstadoError";
import { Paginacion } from "../../../shared/components/Paginacion";

const LIMITE = 8;

export default function CatalogoPage() {
  const [pagina, setPagina] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | undefined>(undefined);

  const { data: categorias } = useCategorias();
  const { data, isLoading, isError } = useProductos({
    skip: pagina * LIMITE,
    limit: LIMITE,
    search: busqueda || undefined,
    categoria_id: categoriaId,
  });

  const totalPaginas = data ? Math.ceil(data.total / LIMITE) : 0;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Catálogo</h1>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          className="border border-gray-400 rounded px-2 py-1"
          placeholder="Buscar producto"
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPagina(0);
          }}
        />
        <select
          className="border border-gray-400 rounded px-2 py-1"
          value={categoriaId ?? ""}
          onChange={(e) => {
            setCategoriaId(e.target.value ? Number(e.target.value) : undefined);
            setPagina(0);
          }}
        >
          <option value="">Todas las categorías</option>
          {categorias?.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <Skeleton cantidad={LIMITE} />}
      {isError && <EstadoError mensaje="No se pudieron cargar los productos" />}
      {data && data.items.length === 0 && <EstadoVacio mensaje="No se encontraron productos" />}
      {data && data.items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {data.items.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
      <Paginacion pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  );
}

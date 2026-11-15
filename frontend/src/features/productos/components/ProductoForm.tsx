import { useForm } from "@tanstack/react-form";
import { useGuardarProducto } from "../hooks/useProductos";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import type { Producto } from "../types";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { handleApiError } from "../../../shared/api/handleApiError";

interface ProductoFormProps {
  producto: Producto | null;
  onGuardado: () => void;
}

export function ProductoForm({ producto, onGuardado }: ProductoFormProps) {
  const guardar = useGuardarProducto();
  const { data: categorias } = useCategorias();

  const form = useForm({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      descripcion: producto?.descripcion ?? "",
      precio_base: producto?.precio_base ?? 0,
      imagen_url: producto?.imagen_url ?? "",
      stock: producto?.stock ?? 0,
      disponible: producto?.disponible ?? true,
      categoria_id: producto?.categoria_id ?? 0,
    },
    onSubmit: ({ value }) => {
      guardar.mutate({ id: producto?.id ?? null, datos: value }, { onSuccess: onGuardado });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="nombre" validators={{ onChange: ({ value }) => (value ? undefined : "Ingrese un nombre") }}>
        {(field) => (
          <Input
            label="Nombre"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="descripcion">
        {(field) => (
          <Input label="Descripción" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
        )}
      </form.Field>
      <form.Field name="precio_base" validators={{ onChange: ({ value }) => (value < 0 ? "No puede ser negativo" : undefined) }}>
        {(field) => (
          <Input
            label="Precio"
            type="number"
            value={field.state.value}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            error={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="stock" validators={{ onChange: ({ value }) => (value < 0 ? "No puede ser negativo" : undefined) }}>
        {(field) => (
          <Input
            label="Stock"
            type="number"
            value={field.state.value}
            onChange={(e) => field.handleChange(Number(e.target.value))}
            error={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="imagen_url">
        {(field) => (
          <Input label="URL de imagen" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
        )}
      </form.Field>
      <form.Field name="categoria_id" validators={{ onChange: ({ value }) => (value ? undefined : "Elija una categoría") }}>
        {(field) => (
          <label className="block mb-3">
            <span className="block text-sm mb-1">Categoría</span>
            <select
              className="border border-gray-400 rounded px-2 py-1 w-full"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
            >
              <option value={0}>Seleccionar</option>
              {categorias?.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
            <span className="text-sm text-red-600">{field.state.meta.errors.join(", ")}</span>
          </label>
        )}
      </form.Field>
      <form.Field name="disponible">
        {(field) => (
          <label className="flex gap-2 mb-3">
            <input type="checkbox" checked={field.state.value} onChange={(e) => field.handleChange(e.target.checked)} />
            Disponible
          </label>
        )}
      </form.Field>
      {guardar.isError && <p className="text-red-600 mb-3">{handleApiError(guardar.error)}</p>}
      <Button type="submit" disabled={guardar.isPending}>
        Guardar
      </Button>
    </form>
  );
}

import { useForm } from "@tanstack/react-form";
import { useActualizarStock } from "../hooks/useProductos";
import type { Producto } from "../types";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { handleApiError } from "../../../shared/api/handleApiError";

interface StockFormProps {
  producto: Producto;
  onGuardado: () => void;
}

export function StockForm({ producto, onGuardado }: StockFormProps) {
  const actualizar = useActualizarStock();

  const form = useForm({
    defaultValues: { stock: producto.stock, disponible: producto.disponible },
    onSubmit: ({ value }) => {
      actualizar.mutate({ id: producto.id, datos: value }, { onSuccess: onGuardado });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
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
      <form.Field name="disponible">
        {(field) => (
          <label className="flex gap-2 mb-3">
            <input type="checkbox" checked={field.state.value} onChange={(e) => field.handleChange(e.target.checked)} />
            Disponible
          </label>
        )}
      </form.Field>
      {actualizar.isError && <p className="text-red-600 mb-3">{handleApiError(actualizar.error)}</p>}
      <Button type="submit" disabled={actualizar.isPending}>
        Guardar
      </Button>
    </form>
  );
}

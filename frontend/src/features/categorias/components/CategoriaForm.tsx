import { useForm } from "@tanstack/react-form";
import { useGuardarCategoria } from "../hooks/useCategorias";
import type { Categoria } from "../types";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { handleApiError } from "../../../shared/api/handleApiError";

interface CategoriaFormProps {
  categoria: Categoria | null;
  onGuardado: () => void;
}

export function CategoriaForm({ categoria, onGuardado }: CategoriaFormProps) {
  const guardar = useGuardarCategoria();

  const form = useForm({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      descripcion: categoria?.descripcion ?? "",
    },
    onSubmit: ({ value }) => {
      guardar.mutate({ id: categoria?.id ?? null, datos: value }, { onSuccess: onGuardado });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="nombre"
        validators={{
          onChange: ({ value }) =>
            value.length < 2 || value.length > 100 ? "Entre 2 y 100 caracteres" : undefined,
        }}
      >
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
          <Input
            label="Descripción"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      {guardar.isError && <p className="text-red-600 mb-3">{handleApiError(guardar.error)}</p>}
      <Button type="submit" disabled={guardar.isPending}>
        Guardar
      </Button>
    </form>
  );
}

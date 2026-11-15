import { useForm } from "@tanstack/react-form";
import type { FormaPago } from "../types";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export interface DatosCheckout {
  direccion_entrega: string;
  forma_pago: FormaPago;
  notas: string;
}

interface CheckoutFormProps {
  enviando: boolean;
  onConfirmar: (datos: DatosCheckout) => void;
}

export function CheckoutForm({ enviando, onConfirmar }: CheckoutFormProps) {
  const valoresIniciales: DatosCheckout = { direccion_entrega: "", forma_pago: "EFECTIVO", notas: "" };

  const form = useForm({
    defaultValues: valoresIniciales,
    onSubmit: ({ value }) => onConfirmar(value),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="direccion_entrega"
        validators={{
          onChange: ({ value }) =>
            value.length < 5 || value.length > 200 ? "Entre 5 y 200 caracteres" : undefined,
        }}
      >
        {(field) => (
          <Input
            label="Dirección de entrega"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={field.state.meta.errors.join(", ")}
          />
        )}
      </form.Field>
      <form.Field name="forma_pago">
        {(field) => (
          <label className="block mb-3">
            <span className="block text-sm mb-1">Forma de pago</span>
            <select
              className="border border-gray-400 rounded px-2 py-1 w-full"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value as FormaPago)}
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </label>
        )}
      </form.Field>
      <form.Field name="notas">
        {(field) => (
          <Input label="Notas" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
        )}
      </form.Field>
      <Button type="submit" disabled={enviando}>
        Confirmar pedido
      </Button>
    </form>
  );
}

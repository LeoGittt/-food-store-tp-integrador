import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { registrar } from "../api/auth";
import { useAuthStore } from "../../../store/authStore";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export default function RegisterPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: { username: "", full_name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        await registrar(value);
        await login(value.username, value.password);
        navigate("/");
      } catch (e) {
        setError(handleApiError(e));
      }
    },
  });

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Registrarse</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="username"
          validators={{ onChange: ({ value }) => (value.length < 3 ? "Mínimo 3 caracteres" : undefined) }}
        >
          {(field) => (
            <Input
              label="Usuario"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
        <form.Field
          name="full_name"
          validators={{ onChange: ({ value }) => (value ? undefined : "Ingrese su nombre") }}
        >
          {(field) => (
            <Input
              label="Nombre completo"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
        <form.Field
          name="email"
          validators={{ onChange: ({ value }) => (value.includes("@") ? undefined : "Email inválido") }}
        >
          {(field) => (
            <Input
              label="Email"
              type="email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
        <form.Field
          name="password"
          validators={{ onChange: ({ value }) => (value.length < 8 ? "Mínimo 8 caracteres" : undefined) }}
        >
          {(field) => (
            <Input
              label="Contraseña"
              type="password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              error={field.state.meta.errors.join(", ")}
            />
          )}
        </form.Field>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <Button type="submit">Crear cuenta</Button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "@tanstack/react-form";
import { useAuthStore } from "../../../store/authStore";
import { handleApiError } from "../../../shared/api/handleApiError";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const form = useForm({
    defaultValues: { username: "", password: "" },
    onSubmit: async ({ value }) => {
      setError("");
      try {
        await login(value.username, value.password);
        navigate("/");
      } catch (e) {
        setError(handleApiError(e));
      }
    },
  });

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Ingresar</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="username"
          validators={{ onChange: ({ value }) => (value ? undefined : "Ingrese su usuario") }}
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
          name="password"
          validators={{ onChange: ({ value }) => (value ? undefined : "Ingrese su contraseña") }}
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
        <Button type="submit">Ingresar</Button>
      </form>
      <p className="mt-4">
        ¿No tenés cuenta? <Link to="/register" className="underline">Registrate</Link>
      </p>
    </div>
  );
}

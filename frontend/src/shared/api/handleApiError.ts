import axios from "axios";

export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: unknown } | undefined;
    if (typeof data?.detail === "string") {
      return data.detail;
    }
    if (Array.isArray(data?.detail)) {
      return "Los datos enviados no son válidos";
    }
    return "No se pudo conectar con el servidor";
  }
  return "Ocurrió un error inesperado";
}

import axios from "axios";
import { useAuthStore } from "../../store/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const url = error.config?.url ?? "";
      const status = error.response.status;
      const data = error.response.data as { detail?: unknown };

      const sesionVencida = status === 401 && !url.includes("/auth/token") && !url.includes("/auth/me");
      const cuentaDesactivada = status === 400 && data.detail === "Cuenta de usuario desactivada";

      if (sesionVencida || cuentaDesactivada) {
        useAuthStore.getState().limpiar();
      }
    }
    return Promise.reject(error);
  },
);

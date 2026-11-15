import { api } from "../../../shared/api/axiosInstance";
import type { RegistroData, Usuario } from "../types";

export async function iniciarSesion(username: string, password: string): Promise<void> {
  const formulario = new URLSearchParams();
  formulario.append("username", username);
  formulario.append("password", password);
  await api.post("/auth/token", formulario);
}

export async function cerrarSesion(): Promise<void> {
  await api.post("/auth/logout");
}

export async function obtenerPerfil(): Promise<Usuario> {
  const { data } = await api.get<Usuario>("/auth/me");
  return data;
}

export async function registrar(datos: RegistroData): Promise<Usuario> {
  const { data } = await api.post<Usuario>("/auth/register", datos);
  return data;
}

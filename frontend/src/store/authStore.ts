import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Usuario } from "../features/auth/types";
import { iniciarSesion, cerrarSesion, obtenerPerfil } from "../features/auth/api/auth";

interface AuthState {
  usuario: Usuario | null;
  cargando: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
  limpiar: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      usuario: null,
      cargando: true,

      login: async (username, password) => {
        await iniciarSesion(username, password);
        const usuario = await obtenerPerfil();
        set({ usuario });
      },

      logout: async () => {
        try {
          await cerrarSesion();
        } finally {
          set({ usuario: null });
        }
      },

      checkSession: async () => {
        set({ cargando: true });
        try {
          const usuario = await obtenerPerfil();
          set({ usuario, cargando: false });
        } catch {
          set({ usuario: null, cargando: false });
        }
      },

      limpiar: () => set({ usuario: null }),
    }),
    {
      name: "auth",
      partialize: (state) => ({ usuario: state.usuario }),
    },
  ),
);

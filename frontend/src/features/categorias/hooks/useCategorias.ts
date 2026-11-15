import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actualizarCategoria, crearCategoria, eliminarCategoria, listarCategorias } from "../api/categorias";
import type { CategoriaData } from "../types";

export function useCategorias() {
  return useQuery({ queryKey: ["categorias"], queryFn: listarCategorias });
}

export function useGuardarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number | null; datos: CategoriaData }) =>
      id === null ? crearCategoria(datos) : actualizarCategoria(id, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });
}

export function useEliminarCategoria() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarCategoria,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categorias"] }),
  });
}

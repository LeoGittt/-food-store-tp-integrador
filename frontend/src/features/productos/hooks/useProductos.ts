import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actualizarProducto, actualizarStock, crearProducto, eliminarProducto, listarProductos } from "../api/productos";
import type { FiltrosProductos, ProductoData, StockData } from "../types";

export function useProductos(filtros: FiltrosProductos) {
  return useQuery({
    queryKey: ["productos", filtros],
    queryFn: () => listarProductos(filtros),
  });
}

export function useGuardarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number | null; datos: ProductoData }) =>
      id === null ? crearProducto(datos) : actualizarProducto(id, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });
}

export function useActualizarStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, datos }: { id: number; datos: StockData }) => actualizarStock(id, datos),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });
}

export function useEliminarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: eliminarProducto,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["productos"] }),
  });
}

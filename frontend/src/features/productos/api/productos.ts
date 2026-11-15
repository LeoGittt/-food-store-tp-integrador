import { api } from "../../../shared/api/axiosInstance";
import type { FiltrosProductos, Producto, ProductoData, ProductosPaginados, StockData } from "../types";

export async function listarProductos(filtros: FiltrosProductos): Promise<ProductosPaginados> {
  const { data } = await api.get<ProductosPaginados>("/productos", { params: filtros });
  return data;
}

export async function crearProducto(datos: ProductoData): Promise<Producto> {
  const { data } = await api.post<Producto>("/productos", datos);
  return data;
}

export async function actualizarProducto(id: number, datos: ProductoData): Promise<Producto> {
  const { data } = await api.put<Producto>(`/productos/${id}`, datos);
  return data;
}

export async function actualizarStock(id: number, datos: StockData): Promise<Producto> {
  const { data } = await api.patch<Producto>(`/productos/${id}/stock`, datos);
  return data;
}

export async function eliminarProducto(id: number): Promise<void> {
  await api.delete(`/productos/${id}`);
}

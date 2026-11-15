export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
}

export interface CategoriaData {
  nombre: string;
  descripcion: string;
}

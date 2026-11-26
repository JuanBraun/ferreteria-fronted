export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export type CategoriaFormData = Omit<Categoria, 'id'>;

export interface CategoriaFiltros {
  page?: number;
  limit?: number;
  sortBy?: keyof Categoria;
  order?: 'asc' | 'desc';
  search?: string;
}
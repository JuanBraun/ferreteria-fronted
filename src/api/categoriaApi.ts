import { apiClient } from './apiClient';
import type { PaginatedData } from '../types/api';
import type { Categoria, CategoriaFiltros, CategoriaFormData } from '../types/categoria';

function buildQuery(filtros: CategoriaFiltros = {}): string {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const categoriaApi = {
  listar: (filtros?: CategoriaFiltros) =>
    apiClient.get<PaginatedData<Categoria>>(`/categorias${buildQuery(filtros)}`),

  obtenerPorId: (id: number) =>
    apiClient.get<Categoria>(`/categorias/${id}`),

  crear: (datos: CategoriaFormData) =>
    apiClient.post<Categoria>('/categorias', datos),

  actualizar: (id: number, datos: Partial<CategoriaFormData>) =>
    apiClient.patch<Categoria>(`/categorias/${id}`, datos),

  eliminar: (id: number) =>
    apiClient.delete<void>(`/categorias/${id}`),
};
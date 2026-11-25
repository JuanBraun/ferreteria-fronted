import { apiClient } from './apiClient';
import type { PaginatedData } from '../types/api';
import type { Producto, ProductoFiltros, ProductoFormData } from '../types/producto';

function buildQuery(filtros: ProductoFiltros = {}): string {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
        params.set(key, String(value));
    }
});
    const query = params.toString();
    return query ? `?${query}` : '';
}

export const productoApi = {
    listar: (filtros?: ProductoFiltros) =>
        apiClient.get<PaginatedData<Producto>>(`/productos${buildQuery(filtros)}`),

    obtenerPorId: (id: number) =>
        apiClient.get<Producto>(`/productos/${id}`),

    crear: (datos: ProductoFormData) =>
        apiClient.post<Producto>('/productos', datos),

    actualizar: (id: number, datos: Partial<ProductoFormData>) =>
        apiClient.patch<Producto>(`/productos/${id}`, datos),

    eliminar: (id: number) =>
        apiClient.delete<void>(`/productos/${id}`),
};
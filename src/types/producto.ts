export interface Producto {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stockActual: number;
    stockMinimo: number;
    categoria: string;
}

export type ProductoFormData = Omit<Producto, 'id'>;

export interface ProductoFiltros {
    page?: number;
    limit?: number;
    sortBy?: keyof Producto;
    order?: 'asc' | 'desc';
    nombre?: string;
    codigo?: string;
    categoria?: string;
}
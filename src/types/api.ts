export interface ApiResponse<T> {
  msg: string;
  code: number;
  data: T;
}

export interface PaginatedData<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type RolUsuario = 'Administrador' | 'Empleado' | 'Encargado';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
}
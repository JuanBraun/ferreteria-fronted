export type TipoMovimiento = 'entrada' | 'salida';

export interface Movimiento {
  id: number;
  productoId: number;
  productoNombre?: string;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
  usuarioId?: number;
  usuarioNombre?: string;
  fecha: string;
}

export interface CreateMovimientoDTO {
  productoId: number;
  tipo: TipoMovimiento;
  cantidad: number;
  motivo: string;
  usuarioId?: number;
}

export interface UpdateMovimientoDTO {
  tipo?: TipoMovimiento;
  cantidad?: number;
  motivo?: string;
}
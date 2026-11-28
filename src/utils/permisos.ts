import type { RolUsuario } from '../types/api';

export type ModuloSistema = 'productos' | 'categorias' | 'proveedores' | 'movimientos';

export function puedeVerModulo(rol: RolUsuario | undefined, modulo: ModuloSistema): boolean {
  if (!rol) return false;
  if (modulo === 'proveedores') {
    return rol === 'Administrador' || rol === 'Encargado';
  }
  return true;
}

export function puedeCrear(rol: RolUsuario | undefined, modulo: ModuloSistema): boolean {
  if (!rol) return false;
  if (rol === 'Administrador' || rol === 'Encargado') return true;
  // Empleado (mostrador) solo puede registrar movimientos de entrada/salida
  return modulo === 'movimientos';
}

export function puedeEditar(rol: RolUsuario | undefined, modulo: ModuloSistema): boolean {
  if (!rol) return false;
  if (rol === 'Administrador' || rol === 'Encargado') {
    return Boolean(modulo);
  }
  // Empleado no edita datos maestros ni movimientos históricos
  return false;
}

export function puedeEliminar(rol: RolUsuario | undefined, modulo: ModuloSistema): boolean {
  if (!rol) return false;
  if (rol === 'Administrador') return true;
  // Encargado puede eliminar/anular proveedores y movimientos, pero no productos ni categorías
  if (rol === 'Encargado') {
    return modulo === 'proveedores' || modulo === 'movimientos';
  }
  return false;
}
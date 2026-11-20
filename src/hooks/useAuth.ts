import { createContext, useContext } from 'react';
import type { Usuario, RolUsuario } from '../types/api';

export interface AuthContextType {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (datos: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol?: RolUsuario;
  }) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
}
import React, { useState } from 'react';
import { apiClient } from '../api/apiClient';
import type { Usuario, RolUsuario } from '../types/api';
import { AuthContext } from '../hooks/useAuth';

interface AuthResponse {
  usuario: Usuario;
  token: string;
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const saveSession = (data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    setUser(data.usuario);
  };

  const login = async (email: string, password: string) => {
    const data = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    saveSession(data);
  };

  const register = async (datos: {
    nombre: string;
    apellido: string;
    email: string;
    password: string;
    rol?: RolUsuario;
  }) => {
    const data = await apiClient.post<AuthResponse>('/auth/register', datos);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

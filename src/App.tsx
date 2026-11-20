import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { RecoverPage } from './pages/auth/RecoverPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { MovimientosListPage } from './pages/movimientos/MovimientosListPage';
import { MovimientoDetailPage } from './pages/movimientos/MovimientoDetailPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function ModuloEnConstruccion({ nombre }: { nombre: string }) {
  return (
    <div className="card">
      <h2 style={{ marginBottom: '0.5rem' }}>Módulo de {nombre}</h2>
      <p style={{ color: 'var(--text-muted)' }}>
        Vista base lista para integrar el listado paginado, detalle/ABM y exportación.
      </p>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas de autenticación */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/recover" element={<RecoverPage />} />

          {/* Rutas protegidas dentro del Layout Global */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="productos" element={<ModuloEnConstruccion nombre="Productos" />} />
            <Route path="categorias" element={<ModuloEnConstruccion nombre="Categorías" />} />
            <Route path="proveedores" element={<ModuloEnConstruccion nombre="Proveedores" />} />
            <Route path="movimientos" element={<MovimientosListPage />} />
            <Route path="movimientos/:id" element={<MovimientoDetailPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
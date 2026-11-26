import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { MainLayout } from "./components/layout/MainLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { RecoverPage } from "./pages/auth/RecoverPage";
import { HomePage } from "./pages/HomePage";
import { ProfilePage } from "./pages/ProfilePage";
import { MovimientosListPage } from "./pages/movimientos/MovimientosListPage";
import { MovimientoDetailPage } from "./pages/movimientos/MovimientoDetailPage";
import { ProveedoresListPage } from "./pages/proveedores/ProveedoresListPage";
import { ProveedorDetailPage } from "./pages/proveedores/ProveedorDetailPage";
import { ProductoListPage } from "./pages/productos/ProductoListPage";
import { ProductoDetailPage } from "./pages/productos/ProductoDetailPage";
import { CategoriasListPage } from "./pages/categorias/CategoriasListPage";
import { CategoriaDetailPage } from "./pages/categorias/CategoriaDetailPage";
import type { RolUsuario } from "./types/api";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function RoleRoute({
  children,
  rolesPermitidos,
}: {
  children: React.ReactNode;
  rolesPermitidos: RolUsuario[];
}) {
  const { user } = useAuth();
  if (!user || !rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
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

            {/* Productos */}
            <Route path="productos" element={<ProductoListPage />} />
            <Route
              path="productos/nuevo"
              element={<ProductoDetailPage key="nuevo" modo="crear" />}
            />
            <Route
              path="productos/:id"
              element={<ProductoDetailPage modo="detalle" />}
            />
            <Route
              path="productos/:id/editar"
              element={<ProductoDetailPage modo="editar" />}
            />

            {/* Categorías (Restringido a Administrador y Encargado) */}
            <Route
              path="categorias"
              element={
                <RoleRoute rolesPermitidos={["Administrador", "Encargado"]}>
                  <CategoriasListPage />
                </RoleRoute>
              }
            />
            <Route
              path="categorias/:id"
              element={
                <RoleRoute rolesPermitidos={["Administrador", "Encargado"]}>
                  <CategoriaDetailPage />
                </RoleRoute>
              }
            />

            {/* Proveedores */}
            <Route path="proveedores" element={<ProveedoresListPage />} />
            <Route path="proveedores/:id" element={<ProveedorDetailPage />} />

            {/* Movimientos */}
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

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ArrowLeftRight,
  User,
  LogOut,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-shell">
      {/* Menú Lateral */}
      <aside className="sidebar">
        <div className="sidebar-title">Espacio de Trabajo</div>
        <nav>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Inicio / Dashboard
          </NavLink>
          <NavLink to="/productos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Package size={18} /> Productos
          </NavLink>
          {user?.rol !== 'Empleado' && (
            <NavLink to="/categorias" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Tags size={18} /> Categorías
            </NavLink>
          )}
          <NavLink to="/proveedores" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Truck size={18} /> Proveedores
          </NavLink>
          <NavLink to="/movimientos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ArrowLeftRight size={18} /> Movimientos
          </NavLink>
          <NavLink to="/perfil" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <User size={18} /> Mi Perfil
          </NavLink>
        </nav>
      </aside>

      {/* Contenedor Derecho */}
      <div className="main-wrapper">
        {/* Header */}
        <header className="topbar">
          <div className="topbar-brand">
            <Wrench size={20} />
            <span>FerreGest · Sistema de Inventario</span>
          </div>
          <div className="topbar-user">
            <span>
              {user?.nombre} {user?.apellido} <strong>({user?.rol})</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.35rem 0.7rem' }}>
              <LogOut size={16} /> Salir
            </button>
          </div>
        </header>

        {/* Contenido dinámico de cada ruta */}
        <main className="main-content">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="footer">
          Tecnicatura Universitaria en Programación · Trabajo Final Integrador 2026
        </footer>
      </div>
    </div>
  );
}
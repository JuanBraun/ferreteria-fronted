import { Link } from 'react-router-dom';
import { Package, Tags, Truck, ArrowLeftRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function HomePage() {
  const { user } = useAuth();

  const modulos = [
    {
      titulo: 'Productos',
      descripcion: 'Catálogo, precios, stock actual y alertas de reposición.',
      ruta: '/productos',
      icono: <Package size={24} color="#14362b" />,
      responsable: 'Módulo Core',
    },
    {
      titulo: 'Categorías',
      descripcion: 'Clasificación de rubros y familias de artículos.',
      ruta: '/categorias',
      icono: <Tags size={24} color="#14362b" />,
      responsable: 'Clasificación',
    },
    {
      titulo: 'Proveedores',
      descripcion: 'Padrón de distribuidores, CUIT y datos de contacto.',
      ruta: '/proveedores',
      icono: <Truck size={24} color="#14362b" />,
      responsable: 'Compras',
    },
    {
      titulo: 'Movimientos de Stock',
      descripcion: 'Trazabilidad histórica de entradas y salidas de mercadería.',
      ruta: '/movimientos',
      icono: <ArrowLeftRight size={24} color="#14362b" />,
      responsable: 'Trazabilidad',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
          Hola, {user?.nombre} {user?.apellido}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Panel general de control · Rol activo: <strong>{user?.rol}</strong>
        </p>
      </div>

      {/* Métricas generales del Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              ARTÍCULOS ACTIVOS
            </span>
            <Package size={18} color="#14362b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>148</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>En 12 categorías</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              ALERTA BAJO STOCK
            </span>
            <AlertTriangle size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--warning)' }}>
            6
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Requieren reposición</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              MOVIMIENTOS DEL MES
            </span>
            <ArrowLeftRight size={18} color="#14362b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.5rem' }}>84</div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>52 entradas · 32 salidas</span>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              ESTADO DEL SISTEMA
            </span>
            <CheckCircle2 size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.7rem', color: 'var(--success)' }}>
            Operativo
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>API v1 conectada</span>
        </div>
      </div>

      {/* Accesos rápidos a los módulos */}
      <h2 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Accesos Rápidos a Módulos</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
        }}
      >
        {modulos.map((mod) => (
          <Link
            key={mod.ruta}
            to={mod.ruta}
            className="card"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              transition: 'transform 0.15s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {mod.icono}
              <span
                style={{
                  fontSize: '0.75rem',
                  backgroundColor: '#e6f0ec',
                  color: 'var(--primary)',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                }}
              >
                {mod.responsable}
              </span>
            </div>
            <h3 style={{ fontSize: '1.05rem' }}>{mod.titulo}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{mod.descripcion}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileSpreadsheet, FileText } from 'lucide-react';
import { categoriaApi } from '../../api/categoriaApi';
import type { Categoria } from '../../types/categoria';
import { exportarCategoriasExcel, exportarCategoriasPDF } from '../../utils/exportCategorias';
import { useAuth } from '../../hooks/useAuth';
import { puedeCrear } from '../../utils/permisos';

export function CategoriasListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Categoria>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const fetchCategorias = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await categoriaApi.listar({
          page,
          limit,
          sortBy,
          order,
          search: search.trim() || undefined,
        });

        if (!activo) return;
        setCategorias(data.items);
        setTotal(data.meta.total);
        setTotalPages(data.meta.totalPages || 1);
      } catch (err) {
        if (activo) {
          setError(err instanceof Error ? err.message : 'Error al cargar categorías');
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    void fetchCategorias();
    return () => {
      activo = false;
    };
  }, [page, limit, search, sortBy, order]);

  const handleSort = (campo: keyof Categoria) => {
    if (sortBy === campo) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(campo);
      setOrder('asc');
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Categorías</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Rubros y familias de artículos · Total: <strong>{total}</strong> categorías
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            disabled={categorias.length === 0}
            onClick={() => exportarCategoriasExcel(categorias)}
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            type="button"
            className="btn btn-outline"
            disabled={categorias.length === 0}
            onClick={() => exportarCategoriasPDF(categorias)}
          >
            <FileText size={16} /> PDF
          </button>
          {puedeCrear(user?.rol, 'categorias') && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate('/categorias/nuevo')}
            >
              <Plus size={16} /> Nueva Categoría
            </button>
          )}
        </div>
      </div>

      <div
        className="card"
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '1rem',
          padding: '1rem',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            className="form-control"
            style={{ width: '100%', paddingLeft: '2.2rem' }}
            placeholder="Buscar por nombre o descripción..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="form-control"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid var(--border)',
                backgroundColor: '#f9fafb',
              }}
            >
              <th
                style={{ padding: '0.85rem 1rem', cursor: 'pointer', width: '90px' }}
                onClick={() => handleSort('id')}
              >
                ID {sortBy === 'id' ? (order === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th
                style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                onClick={() => handleSort('nombre')}
              >
                Nombre {sortBy === 'nombre' ? (order === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={{ padding: '0.85rem 1rem' }}>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Cargando categorías...
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No se encontraron categorías con los filtros aplicados.
                </td>
              </tr>
            ) : (
              categorias.map((cat) => (
                <tr
                  key={cat.id}
                  onClick={() => navigate(`/categorias/${cat.id}`)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f4f6f8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>#{cat.id}</td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{cat.nombre}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>
                    {cat.descripcion || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.85rem 1rem',
          backgroundColor: '#f9fafb',
          fontSize: '0.85rem',
          marginTop: '0.5rem',
          borderRadius: '6px',
        }}
      >
        <span style={{ color: 'var(--text-muted)' }}>
          Página <strong>{page}</strong> de <strong>{totalPages}</strong> ({total} resultados)
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn btn-outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}
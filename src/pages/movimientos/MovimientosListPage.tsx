import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileSpreadsheet, FileText, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import type { PaginatedData } from '../../types/api';
import type { Movimiento } from '../../types/movimiento';
import { exportarMovimientosExcel, exportarMovimientosPDF } from '../../utils/exportMovimientos';

export function MovimientosListPage() {
  const navigate = useNavigate();

  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [sortBy, setSortBy] = useState('fecha');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const fetchMovimientos = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sortBy,
          order,
        });
        if (search.trim()) params.append('search', search.trim());
        if (tipoFiltro) params.append('tipo', tipoFiltro);

        const data = await apiClient.get<PaginatedData<Movimiento>>(`/movimientos?${params.toString()}`);
        if (!activo) return;
        setMovimientos(data.items);
        setTotal(data.meta.total);
        setTotalPages(data.meta.totalPages || 1);
      } catch (err) {
        if (activo) {
          setError(err instanceof Error ? err.message : 'Error al cargar movimientos');
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    void fetchMovimientos();

    return () => {
      activo = false;
    };
  }, [page, limit, search, tipoFiltro, sortBy, order]);

  const handleSort = (campo: string) => {
    if (sortBy === campo) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(campo);
      setOrder('asc');
    }
  };

  return (
    <div>
      {/* Encabezado y Acciones principales */}
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
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Movimientos de Stock</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Historial de entradas y salidas de mercadería · Total: <strong>{total}</strong> registros
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => exportarMovimientosExcel(movimientos)}
            disabled={movimientos.length === 0}
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => exportarMovimientosPDF(movimientos)}
            disabled={movimientos.length === 0}
          >
            <FileText size={16} /> PDF
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/movimientos/nuevo')}
          >
            <Plus size={16} /> Nuevo Movimiento
          </button>
        </div>
      </div>

      {/* Barra de Filtros */}
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
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-control"
            style={{ width: '100%', paddingLeft: '2.2rem' }}
            placeholder="Buscar por motivo o producto..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <select
          className="form-control"
          value={tipoFiltro}
          onChange={(e) => {
            setTipoFiltro(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Todos los tipos</option>
          <option value="entrada">Solo Entradas</option>
          <option value="salida">Solo Salidas</option>
        </select>

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

      {/* Tabla de Resultados */}
      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: '#f9fafb' }}>
              <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                ID {sortBy === 'id' ? (order === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('fecha')}>
                Fecha {sortBy === 'fecha' ? (order === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={{ padding: '0.85rem 1rem' }}>Tipo</th>
              <th style={{ padding: '0.85rem 1rem' }}>Producto</th>
              <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('cantidad')}>
                Cantidad {sortBy === 'cantidad' ? (order === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th style={{ padding: '0.85rem 1rem' }}>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Cargando movimientos...
                </td>
              </tr>
            ) : movimientos.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No se encontraron movimientos con los filtros aplicados.
                </td>
              </tr>
            ) : (
              movimientos.map((mov) => (
                <tr
                  key={mov.id}
                  onClick={() => navigate(`/movimientos/${mov.id}`)}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f4f6f5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>#{mov.id}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {new Date(mov.fecha).toLocaleDateString('es-AR')}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {mov.tipo === 'entrada' ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backgroundColor: '#dcfce7',
                          color: '#15803d',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        <ArrowUpCircle size={14} /> ENTRADA
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          backgroundColor: '#fee2e2',
                          color: '#b91c1c',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                        }}
                      >
                        <ArrowDownCircle size={14} /> SALIDA
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    {mov.productoNombre || `Producto #${mov.productoId}`}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{mov.cantidad} u.</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)' }}>{mov.motivo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Controles de Paginación */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.85rem 1rem',
            backgroundColor: '#f9fafb',
            fontSize: '0.85rem',
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
    </div>
  );
}
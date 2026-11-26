import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { productoApi } from '../../api/productoApi';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { exportarProductosExcel, exportarProductosPDF } from '../../utils/exportProductos';
import type { Producto } from '../../types/producto';

export function ProductoListPage() {
    const navigate = useNavigate();

    const [productos, setProductos] = useState<Producto[]>([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [sortBy, setSortBy] = useState<keyof Producto>('id');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let activo = true;

        const fetchProductos = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await productoApi.listar({
            page,
            limit,
            sortBy,
            order,
            search: search.trim() || undefined,
            categoria: categoriaFiltro || undefined,
            });

            if (!activo) return;
            setProductos(data.items);
            setTotal(data.meta.total);
            setTotalPages(data.meta.totalPages || 1);
        } catch (err) {
            if (activo) {
            setError(err instanceof Error ? err.message : 'Error al cargar productos');
            }
        } finally {
            if (activo) setLoading(false);
        }
    };

    void fetchProductos();

    return () => {
        activo = false;
    };
    }, [page, limit, search, categoriaFiltro, sortBy, order]);

    const handleSort = (campo: keyof Producto) => {
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
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Productos</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Catálogo y control de stock · Total: <strong>{total}</strong> productos
            </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-outline"
            disabled={productos.length === 0}
            onClick={() => exportarProductosExcel(productos)}
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            type="button"
            className="btn btn-outline"
            disabled={productos.length === 0}
            onClick={() => exportarProductosPDF(productos)}
          >
            <FileText size={16} /> PDF
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/productos/nuevo')}
          >
            <Plus size={16} /> Nuevo Producto
          </button>
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
        <div style={{ position: 'relative', flex: '1 1 240px' }}>
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
                placeholder="Buscar por nombre..."
                value={search}
                onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                }}
            />
        </div>

        <input
            type="text"
            className="form-control"
            placeholder="Filtrar por categoría..."
            value={categoriaFiltro}
            onChange={(e) => {
                setCategoriaFiltro(e.target.value);
                setPage(1);
            }}
        />

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
                    style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                    onClick={() => handleSort('codigo')}
                >
                Código {sortBy === 'codigo' ? (order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                    style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                    onClick={() => handleSort('nombre')}
                >
                Nombre {sortBy === 'nombre' ? (order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                    style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                    onClick={() => handleSort('categoria')}
                >
                Categoría {sortBy === 'categoria' ? (order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                    style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                    onClick={() => handleSort('precio')}
                >
                Precio {sortBy === 'precio' ? (order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th
                    style={{ padding: '0.85rem 1rem', cursor: 'pointer' }}
                    onClick={() => handleSort('stockActual')}
                >
                Stock {sortBy === 'stockActual' ? (order === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th style={{ padding: '0.85rem 1rem' }}>Estado</th>
            </tr>
            </thead>
                <tbody>
                    {loading ? (
                <tr>
                <td
                    colSpan={6}
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                    }}
                >
                    Cargando productos...
                </td>
                </tr>
                ) : productos.length === 0 ? (
                <tr>
                <td
                    colSpan={6}
                    style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                    }}
                >
                    No se encontraron productos con los filtros aplicados.
                </td>
                </tr>
                ) : (
                productos.map((prod) => {
                    const bajoStock = prod.stockActual <= prod.stockMinimo;
                    return (
                    <tr
                        key={prod.id}
                        onClick={() => navigate(`/productos/${prod.id}`)}
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
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                        {prod.codigo}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>{prod.nombre}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>{prod.categoria}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                        ${prod.precio.toLocaleString('es-AR')}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                        {prod.stockActual}{' '}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                        (mín. {prod.stockMinimo})
                        </span>
                    </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                        {bajoStock ? (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                backgroundColor: '#fee2e2',
                                color: '#991b1b',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                            }}
                        >
                            <AlertTriangle size={14} /> BAJO STOCK
                        </span>
                        ) : (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: '#dcfce7',
                                color: '#166534',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '999px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                            }}
                        >
                            OK
                        </span>
                        )}
                        </td>
                    </tr>
                );
                })
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
            Página <strong>{page}</strong> de <strong>{totalPages}</strong> ({total}{' '}
            resultados)
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

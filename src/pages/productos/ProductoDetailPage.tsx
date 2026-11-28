import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Save, AlertTriangle } from 'lucide-react';
import { productoApi } from '../../api/productoApi';
import type { Producto, ProductoFormData } from '../../types/producto';
import { useAuth } from '../../hooks/useAuth';
import { puedeEditar, puedeEliminar } from '../../utils/permisos';

const ESTADO_INICIAL: ProductoFormData = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: 0,
  stockActual: 0,
  stockMinimo: 0,
  categoria: '',
};

interface ProductoDetailPageProps {
  modo?: 'detalle' | 'crear' | 'editar';
}

export function ProductoDetailPage({
  modo = 'detalle',
}: ProductoDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const esCreacion = modo === 'crear' || id === 'nuevo';
  const habilitadoEditar = puedeEditar(user?.rol, 'productos');
  const habilitadoEliminar = puedeEliminar(user?.rol, 'productos');

  const [editando, setEditando] = useState<boolean>(
    esCreacion || (modo === 'editar' && habilitadoEditar),
  );

  const [producto, setProducto] = useState<Producto | null>(null);
  const [form, setForm] = useState<ProductoFormData>(ESTADO_INICIAL);

  const [loading, setLoading] = useState<boolean>(!esCreacion);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (esCreacion || !id) {
      return;
    }

    let activo = true;

    const cargarProducto = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await productoApi.obtenerPorId(Number(id));
        if (!activo) return;
        setProducto(data);
        setForm({
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: data.precio,
          stockActual: data.stockActual,
          stockMinimo: data.stockMinimo,
          categoria: data.categoria,
        });
        setEditando(modo === 'editar' && habilitadoEditar);
      } catch (err) {
        if (activo) {
          setError(
            err instanceof Error ? err.message : 'Error al cargar el producto',
          );
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    void cargarProducto();

    return () => {
      activo = false;
    };
  }, [id, esCreacion, modo, habilitadoEditar]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      const payload: ProductoFormData = {
        ...form,
        codigo: form.codigo.trim(),
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        categoria: form.categoria.trim(),
        precio: Number(form.precio),
        stockActual: Number(form.stockActual),
        stockMinimo: Number(form.stockMinimo),
      };

      if (esCreacion) {
        const creado = await productoApi.crear(payload);
        navigate(`/productos/${creado.id}`, { replace: true });
        setEditando(false);
      } else if (id) {
        const actualizado = await productoApi.actualizar(Number(id), payload);
        setProducto(actualizado);
        setEditando(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al guardar el producto',
      );
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    if (!id) return;
    const confirmar = window.confirm(
      '¿Seguro que querés eliminar este producto?',
    );
    if (!confirmar) return;

    setGuardando(true);
    setError('');
    try {
      await productoApi.eliminar(Number(id));
      navigate('/productos', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error al eliminar el producto',
      );
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div
        className="card"
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
        }}
      >
        Cargando producto...
      </div>
    );
  }

  const bajoStock = form.stockActual <= form.stockMinimo;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/productos')}
          >
            <ArrowLeft size={16} /> Volver
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '0.15rem' }}>
              {esCreacion
                ? 'Nuevo Producto'
                : editando
                  ? `Editar Producto #${id}`
                  : producto?.nombre || `Producto #${id}`}
            </h1>
            {!esCreacion && producto && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Código: <strong>{producto.codigo}</strong> · Categoría:{' '}
                <strong>{producto.categoria}</strong>
              </p>
            )}
          </div>
        </div>

        {!esCreacion && !editando && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {habilitadoEditar && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setEditando(true)}
              >
                <Edit3 size={16} /> Editar
              </button>
            )}
            {habilitadoEliminar && (
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: '#991b1b', borderColor: '#fca5a5' }}
                disabled={guardando}
                onClick={handleEliminar}
              >
                <Trash2 size={16} /> Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      {error && <div className="alert-error">{error}</div>}

      {editando ? (
        <form
          className="card"
          style={{ padding: '1.5rem' }}
          onSubmit={handleSubmit}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.35rem',
                  fontWeight: 600,
                }}
              >
                Código
              </label>
              <input
                type="text"
                className="form-control"
                style={{ width: '100%' }}
                required
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.35rem',
                  fontWeight: 600,
                }}
              >
                Nombre
              </label>
              <input
                type="text"
                className="form-control"
                style={{ width: '100%' }}
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.35rem',
                  fontWeight: 600,
                }}
              >
                Categoría
              </label>
              <input
                type="text"
                className="form-control"
                style={{ width: '100%' }}
                required
                value={form.categoria}
                onChange={(e) =>
                  setForm({ ...form, categoria: e.target.value })
                }
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.35rem',
                  fontWeight: 600,
                }}
              >
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-control"
                style={{ width: '100%' }}
                required
                value={form.precio}
                onChange={(e) =>
                  setForm({ ...form, precio: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.35rem',
                  fontWeight: 600,
                }}
              >
                Stock Actual
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                style={{ width: '100%' }}
                required
                value={form.stockActual}
                onChange={(e) =>
                  setForm({ ...form, stockActual: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.35rem',
                  fontWeight: 600,
                }}
              >
                Stock Mínimo
              </label>
              <input
                type="number"
                min="0"
                className="form-control"
                style={{ width: '100%' }}
                required
                value={form.stockMinimo}
                onChange={(e) =>
                  setForm({ ...form, stockMinimo: Number(e.target.value) })
                }
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.35rem',
                fontWeight: 600,
              }}
            >
              Descripción
            </label>
            <textarea
              rows={3}
              className="form-control"
              style={{ width: '100%' }}
              value={form.descripcion}
              onChange={(e) =>
                setForm({ ...form, descripcion: e.target.value })
              }
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem',
            }}
          >
            {!esCreacion && (
              <button
                type="button"
                className="btn btn-outline"
                disabled={guardando}
                onClick={() => {
                  if (producto) {
                    setForm({
                      codigo: producto.codigo,
                      nombre: producto.nombre,
                      descripcion: producto.descripcion,
                      precio: producto.precio,
                      stockActual: producto.stockActual,
                      stockMinimo: producto.stockMinimo,
                      categoria: producto.categoria,
                    });
                  }
                  setEditando(false);
                }}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={guardando}
            >
              <Save size={16} /> {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      ) : (
        producto && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              {bajoStock ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    padding: '0.25rem 0.7rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  <AlertTriangle size={14} /> BAJO STOCK (Actual:{' '}
                  {producto.stockActual} / Mínimo: {producto.stockMinimo})
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    backgroundColor: '#dcfce7',
                    color: '#166534',
                    padding: '0.25rem 0.7rem',
                    borderRadius: '999px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  STOCK OK
                </span>
              )}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Código
                </div>
                <div style={{ fontWeight: 600 }}>{producto.codigo}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Categoría
                </div>
                <div style={{ fontWeight: 600 }}>{producto.categoria}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Precio
                </div>
                <div style={{ fontWeight: 600 }}>
                  ${producto.precio.toLocaleString('es-AR')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Stock Actual
                </div>
                <div style={{ fontWeight: 600 }}>{producto.stockActual}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Stock Mínimo
                </div>
                <div style={{ fontWeight: 600 }}>{producto.stockMinimo}</div>
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '0.25rem',
                }}
              >
                Descripción
              </div>
              <p style={{ margin: 0 }}>
                {producto.descripcion || 'Sin descripción'}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
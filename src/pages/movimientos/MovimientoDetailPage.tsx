import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import { useAuth } from '../../hooks/useAuth';
import type { Movimiento, TipoMovimiento } from '../../types/movimiento';

interface ProductoOption {
  id: number;
  nombre: string;
  stockActual: number;
}

export function MovimientoDetailPage() {
  const { id } = useParams();
  const isNew = id === 'nuevo';
  const navigate = useNavigate();
  const { user } = useAuth();

  const [productos, setProductos] = useState<ProductoOption[]>([]);
  const [productoId, setProductoId] = useState<number>(1);
  const [tipo, setTipo] = useState<TipoMovimiento>('entrada');
  const [cantidad, setCantidad] = useState<number>(1);
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const inicializar = async () => {
      try {
        const res = await apiClient.get<{ productos?: ProductoOption[]; items?: ProductoOption[] } | ProductoOption[]>('/productos?limit=100');
        if (!activo) return;
        const lista = Array.isArray(res) ? res : res.productos || res.items || [];
        setProductos(lista);
        if (isNew && lista.length > 0) {
          setProductoId(lista[0].id);
        }
      } catch {
        // Fallback silencioso si productos aún no tiene datos
      }

      if (!isNew && id) {
        setLoading(true);
        try {
          const mov = await apiClient.get<Movimiento>(`/movimientos/${id}`);
          if (!activo) return;
          setProductoId(mov.productoId);
          setTipo(mov.tipo);
          setCantidad(mov.cantidad);
          setMotivo(mov.motivo);
          setFecha(mov.fecha);
        } catch (err) {
          if (activo) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el movimiento');
          }
        } finally {
          if (activo) setLoading(false);
        }
      }
    };

    void inicializar();

    return () => {
      activo = false;
    };
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isNew) {
        await apiClient.post('/movimientos', {
          productoId: Number(productoId),
          tipo,
          cantidad: Number(cantidad),
          motivo,
          usuarioId: user?.id,
        });
      } else {
        await apiClient.patch(`/movimientos/${id}`, {
          tipo,
          cantidad: Number(cantidad),
          motivo,
        });
      }
      navigate('/movimientos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el movimiento');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este movimiento?')) return;
    setSaving(true);
    try {
      await apiClient.delete(`/movimientos/${id}`);
      navigate('/movimientos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el movimiento');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card">Cargando detalle del movimiento...</div>;
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate('/movimientos')}
        style={{ marginBottom: '1rem' }}
      >
        <ArrowLeft size={16} /> Volver al listado
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.35rem' }}>
              {isNew ? 'Registrar Nuevo Movimiento' : `Detalle de Movimiento #${id}`}
            </h1>
            {!isNew && fecha && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Registrado el {new Date(fecha).toLocaleString('es-AR')}
              </span>
            )}
          </div>

          {!isNew && (
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={saving}>
              <Trash2 size={16} /> Eliminar
            </button>
          )}
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Producto</label>
            {productos.length > 0 ? (
              <select
                className="form-control"
                value={productoId}
                onChange={(e) => setProductoId(Number(e.target.value))}
                disabled={!isNew}
                required
              >
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} (Stock actual: {p.stockActual ?? '-'})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                min={1}
                className="form-control"
                value={productoId}
                onChange={(e) => setProductoId(Number(e.target.value))}
                disabled={!isNew}
                required
              />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Tipo de Movimiento</label>
              <select
                className="form-control"
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoMovimiento)}
                required
              >
                <option value="entrada">ENTRADA (Ingreso de stock)</option>
                <option value="salida">SALIDA (Egreso / Venta)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                min={1}
                className="form-control"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Motivo / Observación</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Compra a proveedor, venta mostrador, ajuste de inventario..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/movimientos')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : isNew ? 'Registrar Movimiento' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
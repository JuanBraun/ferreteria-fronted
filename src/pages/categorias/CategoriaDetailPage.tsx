import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Trash2, Save } from 'lucide-react';
import { categoriaApi } from '../../api/categoriaApi';
import type { Categoria, CategoriaFormData } from '../../types/categoria';
import { useAuth } from '../../hooks/useAuth';
import { puedeEditar, puedeEliminar } from '../../utils/permisos';

export function CategoriaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const esCreacion = !id || id === 'nuevo';
  const habilitadoEditar = puedeEditar(user?.rol, 'categorias');
  const habilitadoEliminar = puedeEliminar(user?.rol, 'categorias');

  const [editando, setEditando] = useState(esCreacion);

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [form, setForm] = useState<CategoriaFormData>({ nombre: '', descripcion: '' });

  const [loading, setLoading] = useState(!esCreacion);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (esCreacion || !id) {
      return;
    }

    let activo = true;
    const cargar = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await categoriaApi.obtenerPorId(Number(id));
        if (!activo) return;
        setCategoria(data);
        setForm({ nombre: data.nombre, descripcion: data.descripcion || '' });
        setEditando(false);
      } catch (err) {
        if (activo) {
          setError(err instanceof Error ? err.message : 'Error al cargar la categoría');
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    void cargar();
    return () => {
      activo = false;
    };
  }, [id, esCreacion]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setGuardando(true);

    try {
      const payload: CategoriaFormData = {
        nombre: form.nombre.trim(),
        descripcion: form.descripcion?.trim() || '',
      };

      if (esCreacion) {
        const creada = await categoriaApi.crear(payload);
        navigate(`/categorias/${creada.id}`, { replace: true });
        setEditando(false);
      } else if (id) {
        const actualizada = await categoriaApi.actualizar(Number(id), payload);
        setCategoria(actualizada);
        setEditando(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la categoría');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    if (!id || !window.confirm('¿Seguro que querés eliminar esta categoría?')) return;
    setGuardando(true);
    setError('');
    try {
      await categoriaApi.eliminar(Number(id));
      navigate('/categorias', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la categoría');
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Cargando categoría...
      </div>
    );
  }

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
          <button type="button" className="btn btn-outline" onClick={() => navigate('/categorias')}>
            <ArrowLeft size={16} /> Volver
          </button>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>
            {esCreacion
              ? 'Nueva Categoría'
              : editando
                ? `Editar Categoría #${id}`
                : categoria?.nombre || `Categoría #${id}`}
          </h1>
        </div>

        {!esCreacion && !editando && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {habilitadoEditar && (
              <button type="button" className="btn btn-outline" onClick={() => setEditando(true)}>
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
        <form className="card" style={{ padding: '1.5rem' }} onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Nombre</label>
            <input
              type="text"
              className="form-control"
              style={{ width: '100%' }}
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>Descripción</label>
            <textarea
              rows={3}
              className="form-control"
              style={{ width: '100%' }}
              value={form.descripcion || ''}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            {!esCreacion && (
              <button
                type="button"
                className="btn btn-outline"
                disabled={guardando}
                onClick={() => {
                  if (categoria) {
                    setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion || '' });
                  }
                  setEditando(false);
                }}
              >
                Cancelar
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              <Save size={16} /> {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      ) : (
        categoria && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID</div>
              <div style={{ fontWeight: 600 }}>#{categoria.id}</div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nombre</div>
              <div style={{ fontWeight: 600 }}>{categoria.nombre}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Descripción
              </div>
              <p style={{ margin: 0 }}>{categoria.descripcion || 'Sin descripción'}</p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
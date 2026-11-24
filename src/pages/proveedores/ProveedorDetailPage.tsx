import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { apiClient } from '../../api/apiClient';
import type { Proveedor } from '../../types/proveedor';

export function ProveedorDetailPage() {
  const { id } = useParams();
  const isNew = id === 'nuevo';
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew || !id) return;

    let activo = true;
    const cargarProveedor = async () => {
      setLoading(true);
      try {
        const prov = await apiClient.get<Proveedor>(`/proveedores/${id}`);
        if (!activo) return;
        setNombre(prov.nombre || '');
        setContacto(prov.contacto || '');
        setTelefono(prov.telefono || '');
        setEmail(prov.email || '');
        setDireccion(prov.direccion || '');
      } catch (err) {
        if (activo) {
          setError(err instanceof Error ? err.message : 'No se pudo cargar el proveedor');
        }
      } finally {
        if (activo) setLoading(false);
      }
    };

    void cargarProveedor();

    return () => {
      activo = false;
    };
  }, [id, isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        nombre: nombre.trim(),
        contacto: contacto.trim() || undefined,
        telefono: telefono.trim() || undefined,
        email: email.trim() || undefined,
        direccion: direccion.trim() || undefined,
      };

      if (isNew) {
        await apiClient.post('/proveedores', payload);
      } else {
        await apiClient.patch(`/proveedores/${id}`, payload);
      }
      navigate('/proveedores');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el proveedor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que querés eliminar este proveedor?')) return;
    setSaving(true);
    try {
      await apiClient.delete(`/proveedores/${id}`);
      navigate('/proveedores');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el proveedor');
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card">Cargando detalle del proveedor...</div>;
  }

  return (
    <div style={{ maxWidth: '640px' }}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={() => navigate('/proveedores')}
        style={{ marginBottom: '1rem' }}
      >
        <ArrowLeft size={16} /> Volver al listado
      </button>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.35rem' }}>
              {isNew ? 'Registrar Nuevo Proveedor' : `Detalle de Proveedor #${id}`}
            </h1>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isNew ? 'Completá los datos comerciales del proveedor.' : 'Visualización y edición de datos del proveedor.'}
            </span>
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
            <label>Nombre / Razón Social *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Ej: Distribuidora del Sur S.A."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Persona de Contacto</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Carlos Gómez"
                value={contacto}
                onChange={(e) => setContacto(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Teléfono</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: 291-4551234"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="contacto@proveedor.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Dirección</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ej: Av. Colón 1250, Bahía Blanca"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/proveedores')}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Guardando...' : isNew ? 'Registrar Proveedor' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
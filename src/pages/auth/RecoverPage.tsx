import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/apiClient';

export function RecoverPage() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setLoading(true);
    try {
      const res = await apiClient.post<{ instrucciones: string }>('/auth/recover', { email });
      setMensaje(res.instrucciones);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <h2 style={{ marginBottom: '0.25rem' }}>Recuperar Contraseña</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          Ingresá tu email para recibir instrucciones
        </p>

        {error && <div className="alert-error">{error}</div>}
        {mensaje && <div className="alert-success">{mensaje}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email registrado</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <Link to="/login">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
}
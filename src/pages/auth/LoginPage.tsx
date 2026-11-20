import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const [email, setEmail] = useState('admin@ferreteria.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Wrench size={32} color="#14362b" />
          <h2 style={{ marginTop: '0.5rem' }}>FerreGest</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ingresá al sistema de gestión</p>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/register">Crear cuenta</Link>
          <Link to="/recover">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
}
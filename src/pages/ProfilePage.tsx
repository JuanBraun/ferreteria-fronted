import { User, Mail, ShieldCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Mi Perfil</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
        Información de la cuenta activa en el sistema
      </p>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: '#e6f0ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <User size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem' }}>
              {user.nombre} {user.apellido}
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID de usuario: #{user.id}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Mail size={18} color="var(--text-muted)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Correo electrónico</div>
            <div style={{ fontWeight: 500 }}>{user.email}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={18} color="var(--text-muted)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rol asignado</div>
            <div style={{ fontWeight: 500 }}>{user.rol}</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <CheckCircle size={18} color="var(--success)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estado de cuenta</div>
            <div style={{ fontWeight: 500, color: 'var(--success)' }}>
              {user.activo ? 'Activa' : 'Inactiva'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
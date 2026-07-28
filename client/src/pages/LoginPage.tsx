import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, ApiError } from '../services/api';

function LoginPage() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const action = isRegister ? authApi.register : authApi.login;
      const data = await action(email, password);
      localStorage.setItem('token', data.token);
      navigate('/inventory');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <span style={styles.logoIcon}>🚗</span>
          <h1 style={styles.title}>AutoVault</h1>
          <p style={styles.subtitle}>Car Dealership Management</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.formTitle}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@dealership.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Sign In'}
          </button>

          <p style={styles.toggle}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              style={styles.toggleButton}
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: '3rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  },
  logoSection: {
    textAlign: 'center' as const,
    marginBottom: '2rem',
  },
  logoIcon: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    color: 'var(--color-text-muted)',
    fontSize: '0.875rem',
    marginTop: '0.25rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  formTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    textAlign: 'center' as const,
  },
  error: {
    background: 'rgba(255, 77, 106, 0.1)',
    border: '1px solid var(--color-danger)',
    color: 'var(--color-danger)',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.875rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.375rem',
  },
  label: {
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--color-text-muted)',
  },
  input: {
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.75rem 1rem',
    fontSize: '0.9375rem',
    color: 'var(--color-text)',
    transition: 'border-color var(--transition)',
  },
  button: {
    background: 'linear-gradient(135deg, var(--color-primary), #5a52d9)',
    color: '#fff',
    padding: '0.875rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'opacity var(--transition), transform var(--transition)',
    marginTop: '0.5rem',
  },
  toggle: {
    textAlign: 'center' as const,
    fontSize: '0.875rem',
    color: 'var(--color-text-muted)',
  },
  toggleButton: {
    background: 'none',
    color: 'var(--color-primary)',
    fontWeight: 600,
    fontSize: '0.875rem',
    padding: 0,
  },
};

export default LoginPage;

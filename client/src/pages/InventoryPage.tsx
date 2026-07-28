import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { carsApi, type Car } from '../services/api';

function InventoryPage() {
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    carsApi
      .getAll()
      .then(setCars)
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>🚗</span>
          <h1 style={styles.headerTitle}>AutoVault Inventory</h1>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      {/* Content */}
      <main style={styles.main}>
        {loading ? (
          <p style={styles.loadingText}>Loading inventory...</p>
        ) : cars.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🏎️</span>
            <h2 style={styles.emptyTitle}>No cars in inventory</h2>
            <p style={styles.emptySubtitle}>
              Add your first car to get started.
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {cars.map((car) => (
              <div key={car.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.carName}>
                    {car.year} {car.make} {car.model}
                  </h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        car.status === 'available'
                          ? 'rgba(0, 212, 170, 0.15)'
                          : car.status === 'sold'
                          ? 'rgba(255, 77, 106, 0.15)'
                          : 'rgba(255, 184, 77, 0.15)',
                      color:
                        car.status === 'available'
                          ? 'var(--color-success)'
                          : car.status === 'sold'
                          ? 'var(--color-danger)'
                          : 'var(--color-warning)',
                    }}
                  >
                    {car.status}
                  </span>
                </div>
                <div style={styles.cardDetails}>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Price</span>
                    <span style={styles.detailValue}>
                      ${car.price.toLocaleString()}
                    </span>
                  </div>
                  <div style={styles.detail}>
                    <span style={styles.detailLabel}>Mileage</span>
                    <span style={styles.detailValue}>
                      {car.mileage.toLocaleString()} mi
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    background: 'var(--color-surface)',
    borderBottom: '1px solid var(--color-border)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    fontSize: '1.5rem',
  },
  headerTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text-muted)',
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.875rem',
    transition: 'all var(--transition)',
  },
  main: {
    flex: 1,
    padding: '2rem',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
  },
  loadingText: {
    textAlign: 'center',
    color: 'var(--color-text-muted)',
    marginTop: '4rem',
    fontSize: '1.125rem',
  },
  emptyState: {
    textAlign: 'center',
    marginTop: '6rem',
  },
  emptyIcon: {
    fontSize: '4rem',
    display: 'block',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  emptySubtitle: {
    color: 'var(--color-text-muted)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    transition: 'border-color var(--transition), box-shadow var(--transition)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  carName: {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'capitalize',
  },
  cardDetails: {
    display: 'flex',
    gap: '2rem',
  },
  detail: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '1rem',
    fontWeight: 600,
  },
};

export default InventoryPage;

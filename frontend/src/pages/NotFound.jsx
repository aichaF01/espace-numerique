import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const COMPASS = 'M12 2a10 10 0 100 20A10 10 0 0012 2zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z';
const ARROW   = 'M19 12H5M12 5l-7 7 7 7';

export default function NotFound() {
  const navigate     = useNavigate();
  const { token }    = useAuth();

  const handleBack = () => navigate(token ? '/dash' : '/login');

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Icône */}
        <div style={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={COMPASS} />
          </svg>
        </div>

        <div style={styles.code}>404</div>
        <h1 style={styles.title}>Page introuvable</h1>
        <p style={styles.desc}>
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <button style={styles.btnPrimary} onClick={handleBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={ARROW} />
          </svg>
          {token ? 'Retour au dashboard' : 'Retour au login'}
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f6f3',
    padding: '20px',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  card: {
    backgroundColor: '#fff',
    border: '0.5px solid rgba(0,0,0,0.08)',
    borderRadius: '16px',
    padding: '48px 40px',
    maxWidth: '420px',
    width: '100%',
    textAlign: 'center',
  },
  iconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    backgroundColor: '#E6F1FB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
  },
  code: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#bbb',
    letterSpacing: '.1em',
    marginBottom: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    letterSpacing: '-0.02em',
    margin: '0 0 10px',
  },
  desc: {
    fontSize: '14px',
    color: '#888',
    lineHeight: 1.6,
    margin: '0 0 28px',
  },
  btnPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 20px',
    borderRadius: '8px',
    backgroundColor: '#0F6E56',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    width: '100%',
  },
};
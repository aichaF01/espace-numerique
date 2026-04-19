import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// icons
const SHIELD = 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z';
const ARROW  = 'M19 12H5M12 5l-7 7 7 7';

export default function Unauthorized() {
  const navigate      = useNavigate();
  const { role, logout } = useAuth();

  const handleBack = () => navigate('/dash');
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Icône */}
        <div style={styles.iconWrap}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="#854F0B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d={SHIELD} />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <div style={styles.code}>403</div>
        <h1 style={styles.title}>Accès non autorisé</h1>
        <p style={styles.desc}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          {role && (
            <span> Votre rôle actuel est <strong>{role}</strong>.</span>
          )}
        </p>

        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={handleBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d={ARROW} />
            </svg>
            Retour au dashboard
          </button>
          <button style={styles.btnOutline} onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>

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
    backgroundColor: '#FAEEDA',
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
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
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
  btnOutline: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: '0.5px solid rgba(0,0,0,0.12)',
    backgroundColor: 'transparent',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    width: '100%',
  },
};
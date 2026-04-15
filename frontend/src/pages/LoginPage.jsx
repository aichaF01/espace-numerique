import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await login(username, password);
      saveToken(data.access_token);
      navigate('/');
    } catch {
      setError('Identifiants incorrects. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="white" strokeWidth="2" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>

        <h1 style={styles.title}>Espace numérique</h1>
        <p style={styles.subtitle}>EST Salé — Connectez-vous à votre espace</p>

        {/* Champ username */}
        <div style={styles.field}>
          <label style={styles.label}>Nom d'utilisateur</label>
          <input
            style={styles.input}
            type="text"
            placeholder="ex: etudiant1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Champ password */}
        <div style={styles.field}>
          <label style={styles.label}>Mot de passe</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Message d'erreur */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Bouton */}
        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <p style={styles.footer}>EST Salé · Plateforme pédagogique numérique</p>
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
    backgroundColor: '#f5f5f3',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '0.5px solid rgba(0,0,0,0.1)',
    borderRadius: '16px',
    padding: '36px',
    width: '80%',
    maxWidth: '500px',
  },
  logo: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: '#0F6E56',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#1a1a1a',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '13px',
    color: '#888',
    margin: '0 0 28px 0',
  },
  field: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#555',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '9px 12px',
    borderRadius: '8px',
    border: '0.5px solid rgba(0,0,0,0.15)',
    backgroundColor: '#fafafa',
    fontSize: '14px',
    color: '#1a1a1a',
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    fontSize: '13px',
    color: '#A32D2D',
    backgroundColor: '#FCEBEB',
    border: '0.5px solid #F09595',
    borderRadius: '8px',
    padding: '8px 12px',
    marginBottom: '12px',
  },
  btn: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#0F6E56',
    border: 'none',
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '4px',
  },
  footer: {
    fontSize: '11px',
    color: '#aaa',
    textAlign: 'center',
    marginTop: '20px',
    marginBottom: 0,
  },
};
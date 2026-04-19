import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';

// ---------------styles------------------
import { styles } from '../styles/login';

//--------------------icons---------------
import { ICONS } from '../components/ui/icons';
import Icon from '../components/ui/icon';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [show, setShow] = useState(false);

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
      navigate('/dash');
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
        <div style={{...styles.field, position: "relative"}}>
          <label style={styles.label}>Mot de passe</label>
          <input
            style={styles.input}
            type={show ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          {/* Eye Button */}
          {password && (
          <button
            onClick={() => setShow(!show)}
            type="button"
            style={styles.eyeIcon}
          >
            <Icon d={show ? ICONS.eyeOff : ICONS.eye} size={20}/>
          </button>
          )}
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
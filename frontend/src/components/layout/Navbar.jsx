import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Icon from '../ui/icon';
import { ICONS } from '../ui/icons';

// ----------------styles----------------------
import { st } from '../../styles/navbar';
import { s } from '../../styles/dashboard';

// ─── config par rôle ──────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  etudiant: { label: 'Étudiant',       bg: '#E1F5EE', color: '#085041' },
  prof:     { label: 'Professeur',     bg: '#E6F1FB', color: '#0C447C' },
  admin:    { label: 'Administrateur', bg: '#FAEEDA', color: '#633806' },
};

function Navbar() {
  const { role, logout } = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);
  const dropRef          = useRef(null);

  const cfg      = ROLE_CONFIG[role] || ROLE_CONFIG.etudiant;
  const initials = (role || 'U')[0].toUpperCase();

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handle = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav style={st.navbar}>

      {/* ── Brand ── */}
      <div style={st.brand}>
        <div style={st.logoBox}>
          <Icon d={ICONS.logo} size={16}/>
        </div>
        <span style={st.brandTxt}>Espace numérique · EST Salé</span>
      </div>

      {/* ── Dropdown profil ── */}
      <div ref={dropRef} style={{ position: 'relative' }}>

        {/* Bouton déclencheur */}
        <button style={st.triggerBtn} onClick={() => setOpen(o => !o)}>
          <div style={st.avatar}>{initials}</div>
          <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
            <div style={st.triggerName}>{cfg.label}</div>
          </div>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{
              flexShrink: 0,
              transition: 'transform .2s',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Menu déroulant */}
        {open && (
          <div style={st.dropdown}>

            {/* En-tête avec avatar + rôle */}
            <div style={st.dropHead}>
              <div style={{ ...st.avatarLg, backgroundColor: cfg.bg, color: cfg.color }}>
                {initials}
              </div>
              <div>
                <div style={st.dropName}>{cfg.label}</div>
                
                <span style={{ ...st.rolePill, backgroundColor: cfg.bg, color: cfg.color }}>
                  {cfg.label}
                </span>
              </div>
            </div>
            
            <div style={st.sep} />

            {/* Déconnexion */}
            <button style={{ ...st.dropItem, color: '#A32D2D' }} onClick={handleLogout}>
              <Icon d={ICONS.logout} size={14} color="#A32D2D" />
              Se déconnecter
            </button>

          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
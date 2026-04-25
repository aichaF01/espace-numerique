import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createCours, listCours } from '../api/cours';
import { createUser, listUsers, deleteUser } from '../api/admin';
import { askAI } from '../api/ai';

// ---------------icons------------------
import Icon from '../components/ui/icon';
import { ICONS } from '../components/ui/icons';

// -------------styles--------------------
import {s} from "../styles/dashboard"
import { styles } from '../styles/login';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import AdminUsers from '../features/admin/AdminUsers';
import ChatbotView from '../features/chatbot/ChatbotView';

import { Outlet } from 'react-router-dom';
// ─── role badge helper ────────────────────────────────────────────────────────
function RoleBadge({ role }) {
  const map = { etudiant: s.badgeEtu, prof: s.badgeProf, admin: s.badgeAdm };
  const label = { etudiant: 'Étudiant', prof: 'Professeur', admin: 'Administrateur' };
  return <span style={map[role] || s.badgeEtu}>{label[role] || role}</span>;
}

// ─── sidebar items per role ───────────────────────────────────────────────────
const sidebarItems = {
  etudiant: [
    { key: 'cours', label: 'Mes cours',     icon: ICONS.cours },
    { key: 'chat',    label: 'Assistant IA',  icon: ICONS.ai },
  ],
  prof: [
    { key: 'upload', label: 'Ajouter un cours', icon: ICONS.upload },
    { key: 'cours',  label: 'Mes cours publiés', icon: ICONS.cours },
    { key: 'chat',     label: 'Assistant IA',      icon: ICONS.ai },
  ],
  admin: [
    { key: 'users', label: 'Utilisateurs', icon: ICONS.users },
    { key: 'chat',    label: 'Assistant IA', icon: ICONS.ai },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// VUES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── vue : liste des cours (étudiant) ────────────────────────────────────────
function EtudiantCours() {
  const [cours, setCours]   = useState([
      {
      id: 1,
      titre: "Docker pour débutants",
      description: "Introduction aux conteneurs",
    },
    {
      id: 2,
      titre: "React avancé",
      description: "Hooks et optimisation",
    },
    {
      id: 3,
      titre: "DevOps",
      description: "CI/CD et GitHub Actions",
    },
  ]);
  // make it true when you test the api
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // useEffect(() => {
  //   listCours()
  //     .then(setCours)
  //     .catch(() => setError('Impossible de charger les cours.'))
  //     .finally(() => setLoading(false));
  // }, []);

  if (loading) return <p style={{ color:'#999', fontSize:'13px' }}>Chargement des cours...</p>;
  if (error)   return <p style={{ color:'#A32D2D', fontSize:'13px' }}>{error}</p>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'24px' }}>
      <div style={s.statsRow}>
        <div style={s.statCard}><div style={s.statLbl}>Cours disponibles</div><div style={s.statVal}>{cours.length}</div><div style={s.statHint}>ce semestre</div></div>
        <div style={s.statCard}><div style={s.statLbl}>Format</div><div style={s.statVal} >PDF</div><div style={s.statHint}>uniquement</div></div>
        <div style={s.statCard}><div style={s.statLbl}>Accès</div><div style={s.statVal}>24/7</div><div style={s.statHint}>en ligne</div></div>
      </div>

      <div style={s.card}>
        <div style={s.secTitle}>Cours disponibles</div>
        {cours.length === 0
          ? <p style={{ fontSize:'13px', color:'#bbb' }}>Aucun cours publié pour le moment.</p>
          : (
            <div style={s.coursList}>
              {cours.map((c) => (
                <div key={c.id} style={s.coursRow}>
                  <div style={s.coursIcon}><Icon d={ICONS.file} /></div>
                  <div style={s.coursInfo}>
                    <div style={s.coursTit}>{c.titre}</div>
                    <div style={s.coursMeta}>{c.description}</div>
                  </div>
                  <a href={c.download_url} target="_blank" rel="noreferrer">
                    <button style={s.btnOutline}>
                      <Icon d={ICONS.download} size={13} /> Télécharger
                    </button>
                  </a>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}

// ─── vue : upload (prof) ─────────────────────────────────────────────────────
function ProfUpload() {
  const [titre, setTitre]   = useState('');
  const [desc, setDesc]     = useState('');
  const [fichier, setFichier] = useState(null);
  const [msg, setMsg]       = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!titre || !fichier) { setError('Titre et fichier sont obligatoires.'); return; }
    setLoading(true); setError(''); setMsg('');
    try {
      const fd = new FormData();
      fd.append('titre', titre);
      fd.append('description', desc);
      fd.append('fichier', fichier);
      await createCours(fd);
      setMsg('Cours publié avec succès !');
      setTitre(''); setDesc(''); setFichier(null);
    } catch {
      setError('Erreur lors de la publication. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Publier un nouveau cours</div>

      <div style={s.formGrid}>
        <div style={s.formGrp}>
          <label style={s.formLbl}>Titre du cours *</label>
          <input style={s.formInp} value={titre} onChange={e => setTitre(e.target.value)} placeholder="ex: Introduction à Python" />
        </div>
        <div style={s.formGrp}>
          <label style={s.formLbl}>Description</label>
          <input style={s.formInp} value={desc} onChange={e => setDesc(e.target.value)} placeholder="ex: Bases du langage..." />
        </div>
        <div style={{ ...s.formGrp, gridColumn:'1/-1' }}>
          <label style={s.formLbl}>Fichier PDF *</label>
          <label style={s.dropZone}>
            <div style={s.dropTxt}>Cliquez pour sélectionner un fichier PDF</div>
            <div style={s.dropHint}>PDF uniquement · max 50 MB</div>
            <input type="file" accept=".pdf" style={{ display:'none' }}
              onChange={e => setFichier(e.target.files[0])} />
          </label>
          {fichier && (
            <div style={s.uploadedFile}>
              <Icon d={ICONS.file} size={14} />
              {fichier.name} — {(fichier.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
        </div>
      </div>

      {error && <p style={{ fontSize:'13px', color:'#A32D2D', margin:'12px 0 0' }}>{error}</p>}
      {msg   && <p style={{ fontSize:'13px', color:'#085041', margin:'12px 0 0' }}>{msg}</p>}

      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'16px' }}>
        <button style={{ ...s.btnPrimary, opacity: loading ? 0.7 : 1 }} onClick={handleUpload} disabled={loading}>
          <Icon d={ICONS.upload} size={14} />
          {loading ? 'Publication...' : 'Publier le cours'}
        </button>
      </div>
    </div>
  );
}

// ─── vue : cours publiés (prof) ───────────────────────────────────────────────
function ProfCours() {
  const [cours, setCours]   = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   listCours().then(setCours).finally(() => setLoading(false));
  // }, []);

  if (loading) return <p style={{ color:'#999', fontSize:'13px' }}>Chargement...</p>;

  return (
    <div style={s.card}>
      <div style={s.secTitle}>Cours publiés</div>
      {cours.length === 0
        ? <p style={{ fontSize:'13px', color:'#bbb' }}>Aucun cours publié pour le moment.</p>
        : (
          <div style={s.coursList}>
            {cours.map((c) => (
              <div key={c.id} style={s.coursRow}>
                <div style={s.coursIcon}><Icon d={ICONS.file} /></div>
                <div style={s.coursInfo}>
                  <div style={s.coursTit}>{c.titre}</div>
                  <div style={s.coursMeta}>{c.description}</div>
                </div>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}
// ─── vue : chatbot IA ─────────────────────────────────────────────────────────
{/* <ChatbotView/> */}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { role, username, logout } = useAuth();
  const navigate = useNavigate();

  // vue active par défaut selon le rôle
  const defaultView = { etudiant:'cours', prof:'upload', admin:'users' };
  const [activeView, setActiveView] = useState(defaultView[role] || 'cours');

  const handleLogout = () => { logout(); navigate('/login'); };

  // titres des vues
  const viewMeta = {
    cours:  { title:'Mes cours',          sub:'Consulter et télécharger les cours disponibles' },
    upload: { title:'Publier un cours',   sub:'Renseignez les informations et déposez votre fichier PDF' },
    users:  { title:'Gestion des utilisateurs', sub:'Créer et gérer les comptes de la plateforme' },
    chat:     { title:'Assistant IA',       sub:'Posez vos questions pédagogiques à Llama 3' },
  };

  const meta = viewMeta[activeView] || {};
  const items = sidebarItems[role] || [];

  // initiales pour l'avatar
  const initials = (role || 'U')[0].toUpperCase();

  return (
    <div style={s.app}>
      
      <Navbar username={username}/>

      <div style={s.body}>

        {/* ── SIDEBAR ── */}
        <Sidebar 
          items={items}
          role={role}
          // activeView={activeView}
          // onSelect={setActiveView}
        />

        {/* ── CONTENU ── */}
        <main style={s.content}>
          <div style={s.pageHead}>
            <div>
              <h1 style={s.pageTitle}>{meta.title}</h1>
              <p style={s.pageSub}>{meta.sub}</p>
            </div>
          </div>
          {/* Rendu conditionnel selon la vue active */}
          {/* {activeView === 'cours'  && role === 'etudiant' && <EtudiantCours />}
          {activeView === 'cours'  && role === 'prof'     && <ProfCours />}
          {activeView === 'upload' && role === 'prof'     && <ProfUpload />}
          {activeView === 'users'  && role === 'admin'    && <AdminUsers />}
          {activeView === 'chat'                            && <ChatbotView />} */}

          <Outlet/>
        </main>

      </div>
    </div>
  );
}
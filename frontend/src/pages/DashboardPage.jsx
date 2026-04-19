import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listCours, uploadCours } from '../api/cours';
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

// ─── icônes SVG inline ───────────────────────────────────────────────────────
// const Icon = ({ d, size = 16 }) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
//     stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
//     <path d={d} />
//   </svg>
// );

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
    { key: 'ai',    label: 'Assistant IA',  icon: ICONS.ai },
  ],
  prof: [
    { key: 'upload', label: 'Ajouter un cours', icon: ICONS.upload },
    { key: 'cours',  label: 'Mes cours publiés', icon: ICONS.cours },
    { key: 'ai',     label: 'Assistant IA',      icon: ICONS.ai },
  ],
  admin: [
    { key: 'users', label: 'Utilisateurs', icon: ICONS.users },
    { key: 'ai',    label: 'Assistant IA', icon: ICONS.ai },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// VUES
// ═══════════════════════════════════════════════════════════════════════════════

// ─── vue : liste des cours (étudiant) ────────────────────────────────────────
function EtudiantCours() {
  const [cours, setCours]   = useState([]);
  const [loading, setLoading] = useState(true);
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
      await uploadCours(fd);
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

// ─── vue : gestion utilisateurs (admin) ──────────────────────────────────────
function AdminUsers() {
  const [users, setUsers]   = useState([
    { username: "admin1", email: "admin@est.ma", role: "admin" },
    { username: "prof1", email: "prof@est.ma", role: "prof" },
    { username: "etudiant1", email: "etudiant@est.ma", role: "etudiant" }
  ]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]     = useState({ username:'', email:'', password:'', role:'etudiant' });
  const [msg, setMsg]       = useState('');
  const [error, setError]   = useState('');
  const [creating, setCreating] = useState(false);

  //------------eyeIcon----------------
  const [show, setShow] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    listUsers().then(setUsers).finally(() => setLoading(false));
  };

  // useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) {
      setError('Tous les champs sont obligatoires.'); return;
    }
    setCreating(true); setError(''); setMsg('');
    try {
      await createUser(form);
      setMsg(`Compte "${form.username}" créé avec succès.`);
      setForm({ username:'', email:'', password:'', role:'etudiant' });
      fetchUsers();
    } catch {
      setError('Erreur lors de la création. Cet utilisateur existe peut-être déjà.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (username) => {
    if (!window.confirm(`Supprimer "${username}" ?`)) return;
    try {
      await deleteUser(username);
      fetchUsers();
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const badgeStyle = (role) =>
    role === 'admin' ? s.badgeAdm : role === 'prof' ? s.badgeProf : s.badgeEtu;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Formulaire création */}
      <div style={s.card}>
        <div style={s.secTitle}>Créer un compte</div>
        <div style={s.formGrid}>
          <div style={s.formGrp}>
            <label style={s.formLbl}>Nom d'utilisateur *</label>
            <input style={s.formInp} value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              placeholder="ex: etudiant_test" />
          </div>
          <div style={s.formGrp}>
            <label style={s.formLbl}>Email *</label>
            <input style={s.formInp} value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="test@est.ma" />
          </div>
          <div style={{...s.formGrp,position:"relative"}}>
            <label style={s.formLbl}>Mot de passe *</label>
            <input style={s.formInp} type={show ? "text" : "password"} value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="••••••••" />
              {/* Eye Button */}
                {form.password && (
                <button
                  onClick={() => setShow(!show)}
                  type="button"
                  style={styles.eyeIcon}
                >
                  <Icon d={show ? ICONS.eyeOff : ICONS.eye} size={20}/>
                </button>
                )}
          </div>
          <div style={s.formGrp}>
            <label style={s.formLbl}>Rôle</label>
            <select style={s.formInp} value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}>
              <option value="etudiant">Étudiant</option>
              <option value="prof">Professeur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>

        {error && <p style={{ fontSize:'13px', color:'#A32D2D', margin:'12px 0 0' }}>{error}</p>}
        {msg   && <p style={{ fontSize:'13px', color:'#085041', margin:'12px 0 0' }}>{msg}</p>}

        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:'16px' }}>
          <button style={{ ...s.btnPrimary, opacity: creating ? 0.7 : 1 }}
            onClick={handleCreate} disabled={creating}>
            <Icon d={ICONS.plus} size={14} />
            {creating ? 'Création...' : 'Créer le compte'}
          </button>
        </div>
      </div>

      {/* Liste utilisateurs */}
      <div>
        <div style={{ ...s.secTitle, marginBottom:'12px' }}>Utilisateurs existants</div>
        <div style={s.tableWrap}>
          <div style={s.tableHead}>
            <div>Nom d'utilisateur</div><div>Email</div><div>Rôle</div><div>Action</div>
          </div>
          {loading
            ? <p style={{ padding:'14px 16px', fontSize:'13px', color:'#bbb' }}>Chargement...</p>
            : users.map((u) => (
              <div key={u.username} style={s.tableRow}>
                <div style={{ fontWeight:'500' }}>{u.username}</div>
                <div style={{ fontSize:'12px', color:'#888' }}>{u.email}</div>
                <div><span style={badgeStyle(u.role)}>{u.role}</span></div>
                <div>
                  <button style={s.btnDanger} onClick={() => handleDelete(u.username)}>
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

// ─── vue : chatbot IA ─────────────────────────────────────────────────────────
function ChatbotView() {
  const [messages, setMessages] = useState([
    { role:'ai', text:'Bonjour ! Je suis votre assistant pédagogique. Posez-moi vos questions sur les cours.' }
  ]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading]   = useState(false);

  const send = async () => {
    const q = question.trim();
    if (!q || loading) return;
    setMessages(m => [...m, { role:'user', text: q }]);
    setQuestion('');
    setLoading(true);
    try {
      const data = await askAI(q);
      setMessages(m => [...m, { role:'ai', text: data.answer || data.response || 'Réponse reçue.' }]);
    } catch {
      setMessages(m => [...m, { role:'ai', text: 'Erreur de connexion avec l\'assistant. Réessayez.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ ...s.card, padding:0, overflow:'hidden' }}>
      <div style={s.chatHead}>
        <div style={s.chatDot} />
        <div>
          <div style={{ fontSize:'14px', fontWeight:'600', color:'white' }}>Assistant EST Salé</div>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.65)' }}>Propulsé par Llama 3 via Ollama</div>
        </div>
      </div>
      <div style={s.chatMsgs}>
        {messages.map((m, i) => (
          <div key={i} style={m.role === 'user' ? s.msgUser : s.msgAI}>{m.text}</div>
        ))}
        {loading && <div style={s.msgAI}>L'assistant réfléchit...</div>}
      </div>
      <div style={s.chatBar}>
        <input style={s.chatInp} value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Posez votre question pédagogique..." />
        <button style={s.chatSend} onClick={send}>
          <Icon d={ICONS.send} size={14} />
          Envoyer
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { role, logout } = useAuth();
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
    ai:     { title:'Assistant IA',       sub:'Posez vos questions pédagogiques à Llama 3' },
  };

  const meta = viewMeta[activeView] || {};
  const items = sidebarItems[role] || [];

  // initiales pour l'avatar
  const initials = (role || 'U')[0].toUpperCase();

  return (
    <div style={s.app}>

      {/* ── NAVBAR ── */}
      {/* <nav style={s.navbar}>
        <div style={s.brand}>
          <div style={s.logoBox}>
            <Icon d={ICONS.logo} size={16} />
          </div>
          <span style={s.brandTxt}>Espace numérique · EST Salé</span>
        </div>
        <div style={s.navRight}>
          <RoleBadge role={role} />
          <div style={s.avatar}>{initials}</div>
          <button style={s.btnLogout} onClick={handleLogout}>
            <Icon d={ICONS.logout} size={13} />
            Déconnexion
          </button>
        </div>
      </nav> */}

      <Navbar/>

      <div style={s.body}>

        {/* ── SIDEBAR ── */}
        <Sidebar 
          items={items}
          activeView={activeView}
          onSelect={setActiveView}
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
          {activeView === 'cours'  && role === 'etudiant' && <EtudiantCours />}
          {activeView === 'cours'  && role === 'prof'     && <ProfCours />}
          {activeView === 'upload' && role === 'prof'     && <ProfUpload />}
          {activeView === 'users'  && role === 'admin'    && <AdminUsers />}
          {activeView === 'ai'                            && <ChatbotView />}
        </main>

      </div>
    </div>
  );
}
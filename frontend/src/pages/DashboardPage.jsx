import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listCours, uploadCours } from '../api/cours';
import { createUser, listUsers, deleteUser } from '../api/admin';
import { askAI } from '../api/ai';

// ─── icônes SVG inline ───────────────────────────────────────────────────────
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const ICONS = {
  cours:    'M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 014 17V4a2 2 0 012-2h12a2 2 0 012 2v13M4 19.5V21',
  upload:   'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  users:    'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  ai:       'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  file:     'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6',
  logout:   'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
  send:     'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',
  logo:     'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  trash:    'M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6',
  plus:     'M12 5v14M5 12h14',
};

// ─── styles ──────────────────────────────────────────────────────────────────
const s = {
  // layout
  app:      { display:'flex', flexDirection:'column', minHeight:'100vh', backgroundColor:'#f7f6f3', fontFamily:"'DM Sans', system-ui, sans-serif" },
  navbar:   { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:'56px', backgroundColor:'#fff', borderBottom:'0.5px solid rgba(0,0,0,0.08)', position:'sticky', top:0, zIndex:10 },
  brand:    { display:'flex', alignItems:'center', gap:'10px' },
  logoBox:  { width:'32px', height:'32px', borderRadius:'9px', backgroundColor:'#0F6E56', display:'flex', alignItems:'center', justifyContent:'center', color:'white' },
  brandTxt: { fontSize:'14px', fontWeight:'600', color:'#1a1a1a', letterSpacing:'-0.01em' },
  navRight: { display:'flex', alignItems:'center', gap:'12px' },
  body:     { display:'flex', flex:1 },

  // sidebar
  sidebar:  { width:'220px', backgroundColor:'#fff', borderRight:'0.5px solid rgba(0,0,0,0.07)', padding:'20px 12px', display:'flex', flexDirection:'column', gap:'4px' },
  sideItem: { display:'flex', alignItems:'center', gap:'10px', padding:'9px 10px', borderRadius:'8px', fontSize:'13px', color:'#555', cursor:'pointer', transition:'all .15s', border:'none', background:'transparent', width:'100%', textAlign:'left' },
  sideActive:{ backgroundColor:'#0F6E56', color:'white' },

  // content
  content:  { flex:1, padding:'28px 32px', display:'flex', flexDirection:'column', gap:'24px', overflowY:'auto' },
  pageHead: { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:{ fontSize:'20px', fontWeight:'600', color:'#1a1a1a', letterSpacing:'-0.02em', margin:0 },
  pageSub:  { fontSize:'13px', color:'#888', marginTop:'3px' },

  // stats
  statsRow: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' },
  statCard: { backgroundColor:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:'12px', padding:'16px 18px' },
  statLbl:  { fontSize:'11px', color:'#999', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'.05em' },
  statVal:  { fontSize:'26px', fontWeight:'600', color:'#1a1a1a', letterSpacing:'-0.03em' },
  statHint: { fontSize:'11px', color:'#bbb', marginTop:'4px' },

  // cards
  card:     { backgroundColor:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:'12px', padding:'20px 22px' },
  secTitle: { fontSize:'13px', fontWeight:'600', color:'#1a1a1a', marginBottom:'14px', letterSpacing:'-0.01em' },

  // cours list
  coursList:{ display:'flex', flexDirection:'column', gap:'8px' },
  coursRow: { display:'flex', alignItems:'center', gap:'14px', padding:'12px 14px', backgroundColor:'#fafaf9', borderRadius:'10px', border:'0.5px solid rgba(0,0,0,0.06)' },
  coursIcon:{ width:'36px', height:'36px', borderRadius:'8px', backgroundColor:'#E1F5EE', display:'flex', alignItems:'center', justifyContent:'center', color:'#0F6E56', flexShrink:0 },
  coursInfo:{ flex:1 },
  coursTit: { fontSize:'13px', fontWeight:'500', color:'#1a1a1a' },
  coursMeta:{ fontSize:'11px', color:'#aaa', marginTop:'2px' },

  // form
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px' },
  formGrp:  { display:'flex', flexDirection:'column', gap:'5px' },
  formLbl:  { fontSize:'12px', fontWeight:'500', color:'#666' },
  formInp:  { padding:'9px 11px', borderRadius:'8px', border:'0.5px solid rgba(0,0,0,0.12)', backgroundColor:'#fafaf9', fontSize:'13px', color:'#1a1a1a', outline:'none', width:'100%', boxSizing:'border-box' },
  dropZone: { border:'1.5px dashed rgba(0,0,0,0.15)', borderRadius:'10px', padding:'32px', textAlign:'center', backgroundColor:'#fafaf9', cursor:'pointer' },
  dropTxt:  { fontSize:'13px', color:'#888' },
  dropHint: { fontSize:'11px', color:'#bbb', marginTop:'4px' },

  // table
  tableWrap:{ backgroundColor:'#fff', border:'0.5px solid rgba(0,0,0,0.08)', borderRadius:'12px', overflow:'hidden' },
  tableHead:{ display:'grid', gridTemplateColumns:'1.5fr 2fr 1fr 80px', gap:'12px', padding:'10px 16px', backgroundColor:'#f7f6f3', fontSize:'11px', fontWeight:'600', color:'#999', textTransform:'uppercase', letterSpacing:'.05em' },
  tableRow: { display:'grid', gridTemplateColumns:'1.5fr 2fr 1fr 80px', gap:'12px', padding:'12px 16px', borderTop:'0.5px solid rgba(0,0,0,0.06)', fontSize:'13px', color:'#1a1a1a', alignItems:'center' },

  // badges
  badgeEtu: { display:'inline-block', padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'500', backgroundColor:'#E1F5EE', color:'#085041' },
  badgeProf:{ display:'inline-block', padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'500', backgroundColor:'#E6F1FB', color:'#0C447C' },
  badgeAdm: { display:'inline-block', padding:'2px 9px', borderRadius:'20px', fontSize:'11px', fontWeight:'500', backgroundColor:'#FAEEDA', color:'#633806' },

  // buttons
  btnPrimary:{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 16px', borderRadius:'8px', backgroundColor:'#0F6E56', border:'none', color:'white', fontSize:'13px', fontWeight:'500', cursor:'pointer' },
  btnOutline:{ padding:'5px 12px', borderRadius:'6px', border:'0.5px solid #0F6E56', backgroundColor:'transparent', color:'#0F6E56', fontSize:'12px', cursor:'pointer', fontWeight:'500' },
  btnDanger: { padding:'5px 10px', borderRadius:'6px', border:'0.5px solid #F09595', backgroundColor:'transparent', color:'#A32D2D', fontSize:'12px', cursor:'pointer' },
  btnLogout: { display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', borderRadius:'7px', border:'0.5px solid rgba(0,0,0,0.12)', backgroundColor:'transparent', color:'#666', fontSize:'12px', cursor:'pointer' },
  avatar:   { width:'30px', height:'30px', borderRadius:'50%', backgroundColor:'#f0ede8', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'600', color:'#555', border:'0.5px solid rgba(0,0,0,0.1)' },

  // chat
  chatHead: { backgroundColor:'#0F6E56', padding:'16px 18px', display:'flex', alignItems:'center', gap:'10px' },
  chatDot:  { width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.5)' },
  chatMsgs: { padding:'16px', display:'flex', flexDirection:'column', gap:'10px', backgroundColor:'#f7f6f3', minHeight:'220px', maxHeight:'320px', overflowY:'auto' },
  msgUser:  { alignSelf:'flex-end', maxWidth:'75%', padding:'9px 13px', borderRadius:'12px', borderBottomRightRadius:'3px', backgroundColor:'#0F6E56', color:'white', fontSize:'13px', lineHeight:1.5 },
  msgAI:    { alignSelf:'flex-start', maxWidth:'75%', padding:'9px 13px', borderRadius:'12px', borderBottomLeftRadius:'3px', backgroundColor:'#fff', color:'#1a1a1a', fontSize:'13px', lineHeight:1.5, border:'0.5px solid rgba(0,0,0,0.08)' },
  chatBar:  { display:'flex', gap:'8px', padding:'12px 16px', borderTop:'0.5px solid rgba(0,0,0,0.08)', backgroundColor:'#fff' },
  chatInp:  { flex:1, padding:'8px 11px', borderRadius:'8px', border:'0.5px solid rgba(0,0,0,0.12)', backgroundColor:'#fafaf9', fontSize:'13px', color:'#1a1a1a', outline:'none' },
  chatSend: { padding:'8px 14px', borderRadius:'8px', backgroundColor:'#0F6E56', border:'none', color:'white', fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' },

  // upload feedback
  uploadedFile:{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 12px', backgroundColor:'#E1F5EE', borderRadius:'8px', fontSize:'12px', color:'#085041', marginTop:'8px' },
};

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

  useEffect(() => {
    listCours()
      .then(setCours)
      .catch(() => setError('Impossible de charger les cours.'))
      .finally(() => setLoading(false));
  }, []);

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

  useEffect(() => {
    listCours().then(setCours).finally(() => setLoading(false));
  }, []);

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
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]     = useState({ username:'', email:'', password:'', role:'etudiant' });
  const [msg, setMsg]       = useState('');
  const [error, setError]   = useState('');
  const [creating, setCreating] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    listUsers().then(setUsers).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

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
          <div style={s.formGrp}>
            <label style={s.formLbl}>Mot de passe *</label>
            <input style={s.formInp} type="password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="••••••••" />
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
      <nav style={s.navbar}>
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
      </nav>

      <div style={s.body}>

        {/* ── SIDEBAR ── */}
        <aside style={s.sidebar}>
          {items.map((item) => (
            <button
              key={item.key}
              style={{ ...s.sideItem, ...(activeView === item.key ? s.sideActive : {}) }}
              onClick={() => setActiveView(item.key)}
            >
              <Icon d={item.icon} size={15} />
              {item.label}
            </button>
          ))}
        </aside>

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
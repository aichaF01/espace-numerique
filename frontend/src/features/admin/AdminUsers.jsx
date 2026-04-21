import { useState } from 'react';
import Icon from '../../components/ui/icon';
import { ICONS } from '../../components/ui/icons';
import { s } from '../../styles/dashboard';
import { styles } from '../../styles/login';

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { username: "admin1", email: "admin@est.ma", role: "admin" },
    { username: "prof1", email: "prof@est.ma", role: "prof" },
    { username: "etudiant1", email: "etudiant@est.ma", role: "etudiant" }
  ]);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username:'', email:'', password:'', role:'etudiant' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [show, setShow] = useState(false);

  const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

    const isValidPassword = (password) => {
    // au moins 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    };

  const handleCreate = async () => {
    if (!form.username || !form.email || !form.password) {
        setError('Tous les champs sont obligatoires.');
        return;
    }
    if (!isValidEmail(form.email)) {
        setError('Email invalide (ex: test@est.ma)');
        return;
    }

    if (!isValidPassword(form.password)) {
        setError('Mot de passe ≥ 8 caractères avec majuscule, minuscule et chiffre.');
        return;
    }

    setCreating(true);
    setError('');
    setMsg('');

    try {
      const exists = users.find(u => u.email === form.email);
      if (exists) throw new Error("exists");

      const newUser = { id: Date.now(), ...form };
      setUsers(prev => [...prev, newUser]);

      setMsg(`Compte "${form.username}" créé avec succès.`);
      setForm({ username:'', email:'', password:'', role:'etudiant' });
      setTimeout(() => {
        setMsg('');
      }, 3000);

    } catch {
      setError('Erreur lors de la création.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (username) => {
    if (!window.confirm(`Supprimer "${username}" ?`)) return;
    setUsers(prev => prev.filter(u => u.username !== username));
  };

  const badgeStyle = (role) =>
    role === 'admin' ? s.badgeAdm : role === 'prof' ? s.badgeProf : s.badgeEtu;

  return (
    <div>
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
      </div>    </div>
  );
}
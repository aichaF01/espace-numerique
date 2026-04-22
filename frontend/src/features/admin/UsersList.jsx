import Icon from '../../components/ui/icon';
import { ICONS } from '../../components/ui/icons';
import { s } from '../../styles/dashboard';
import { useNavigate } from 'react-router-dom';

export default function UsersList({ users, onDelete, loading }) {
  const navigate = useNavigate();

  const badgeStyle = (role) =>
    role === 'admin' ? s.badgeAdm :
    role === 'prof' ? s.badgeProf : s.badgeEtu;

  return (
    <div>

      {/* Bouton créer */}
      <div style={{ display:'flex', justifyContent:'flex-start', marginBottom:'12px' }}>
        <button style={s.btnPrimary} onClick={() => navigate('create')}>
          <Icon d={ICONS.plus} size={14} />
          Créer un compte
        </button>
      </div>

      {/* Table */}
      <div style={s.tableWrap}>
        <div style={s.tableHead}>
          <div>Nom</div><div>Email</div><div>Rôle</div><div>Action</div>
        </div>

        {loading ? (
          <p style={{ padding:'12px', color:'#999' }}>Chargement...</p>

        ) : users.length === 0 ? (
          <p style={{ padding:'12px', color:'#bbb' }}>
            Aucun utilisateur pour le moment.
          </p>

        ) : (
          users.map((u) => (
            <div key={u.id || u.username} style={s.tableRow}>
              <div>{u.username}</div>
              <div>{u.email}</div>
              <div>
                <span style={badgeStyle(u.role)}>
                  {u.role}
                </span>
              </div>
              <div>
                <button
                  style={s.btnDanger}
                  onClick={() => onDelete(u.username)}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// import { listUsers, deleteUser } from '../../api/admin';

import UsersList   from './UsersList';
import AddUserForm from './AddUserForm';

const MOCK_USERS = [
  { id: 1, username: 'admin1',    email: 'admin@est.ma',    role: 'admin'    },
  { id: 2, username: 'prof1',     email: 'prof@est.ma',     role: 'prof'     },
  { id: 3, username: 'etudiant1', email: 'etudiant@est.ma', role: 'etudiant' },
];

export default function AdminUsers() {
  const [users, setUsers]     = useState(MOCK_USERS);
  const [loading, setLoading] = useState(false);

  // const fetchUsers = () => {
  //   setLoading(true);
  //   listUsers().then(setUsers).finally(() => setLoading(false));
  // };
  // useEffect(() => { fetchUsers(); }, []);

  const handleDelete = (username) => {
    if (!window.confirm(`Supprimer "${username}" ?`)) return;
    try {
      // await deleteUser(username);
      // fetchUsers();

      // local
      setUsers(prev => prev.filter(u => u.username !== username));
    } catch {
      console.error('Erreur suppression');
    }
  };

  const handleCreated = (newUser) => {
    // local
    setUsers(prev => [...prev, newUser]);

    // avec api :
    // fetchUsers();
  };

  return (
    <Routes>
      <Route
        index
        element={
          <UsersList
            users={users}
            loading={loading}
            onDelete={handleDelete}
          />
        }
      />
      <Route
        path="create"
        element={
          <AddUserForm
            users={users}
            onCreated={handleCreated}
          />
        }
      />
    </Routes>
  );
}
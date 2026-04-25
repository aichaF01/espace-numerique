import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import { listUsers, deleteUser } from "../../api/admin";

import UsersList from "./UsersList";
import AddUserForm from "./AddUserForm";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await listUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer cet utilisateur ?`))
      return;

    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      alert("Erreur lors de la suppression sur le serveur.");
    }
  };

  return (
    <Routes>
      <Route
        index
        element={
          <UsersList users={users} loading={loading} onDelete={handleDelete} />
        }
      />
      <Route path="create" element={<AddUserForm />} />
    </Routes>
  );
}

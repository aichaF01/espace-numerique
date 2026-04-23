import axiosClient from '../config/axiosClient';

// Créer un utilisateur
export const createUser = (userData) =>
  axiosClient.post('/api/admin/users', userData).then(r => r.data);

// Lister tous les utilisateurs
export const listUsers = () =>
  axiosClient.get('/api/admin/users').then(r => r.data);

// Supprimer un utilisateur
export const deleteUser = (username) =>
  axiosClient.delete(`/api/admin/users/${username}`).then(r => r.data);
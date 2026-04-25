import axiosClient from "../config/axiosClient";

// Créer un utilisateur (Envoie vers Nginx -> ms-admin)
export const createUser = (userData) =>
  axiosClient.post("/api/admin/users", userData).then((r) => r.data);

// Lister tous les utilisateurs
export const listUsers = () =>
  axiosClient.get("/api/admin/users").then((r) => r.data);

// Supprimer un utilisateur (Utilise l'ID Cassandra/Keycloak)
export const deleteUser = (userId) =>
  axiosClient.delete(`/api/admin/users/${userId}`).then((r) => r.data);

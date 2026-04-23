import { jwtDecode } from 'jwt-decode';

export const getRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const roles = decoded.realm_access?.roles || [];
    return roles.find((r) => ['etudiant', 'prof', 'admin'].includes(r)) || null;
  } catch {
    return null;
  }
};

export const getUsernameFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    // Keycloak met le username dans "preferred_username"
    return decoded.preferred_username || decoded.sub || null;
  } catch { return null; }
};
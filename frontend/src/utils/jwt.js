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
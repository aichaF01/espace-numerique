import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
 
// Bloque l'accès aux pages publiques (login)
// si l'utilisateur est déjà connecté → redirige vers dashboard
export default function PublicRoute({ children }) {
  const { token } = useAuth();
 
  if (token) return <Navigate to="/dash" replace />;
 
  return children;
}
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleRedirect() {
  const { role } = useAuth();

  const defaultRoutes = {
    admin: '/admin/users',
    prof: '/prof/upload',
    etudiant: '/etudiant/cours',
  };

  return <Navigate to={defaultRoutes[role] || '/login'} replace />;
}
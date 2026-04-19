import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../utils/jwt";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");

  // No token → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const userRole = getRoleFromToken(token);

    // No role found → treat as unauthorized
    if (!userRole) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Role not allowed
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Authorized
    return children;

  } catch (error) {
    // Invalid token
    return <Navigate to="/login" replace />;
  }
}
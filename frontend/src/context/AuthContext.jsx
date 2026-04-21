import { createContext, useContext, useState } from 'react';
import { getRoleFromToken ,getUsernameFromToken} from '../utils/jwt';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const role = token ? getRoleFromToken(token) : null;
  const username = token ? getUsernameFromToken(token) : null;


  const saveToken = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, username, saveToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
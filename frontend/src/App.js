import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// ---------------pages-----------------------
import LoginPage from '../src/pages/LoginPage'
import DashboardPage from './pages/DashboardPage';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// ----------guards------------------------------
import ProtectedRoute from './features/auth/ProtectedRoute';
import PublicRoute from './features/auth/PublicRoute';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <div className="App">
      <Routes>
          {/* Page login — redirige vers dashboard si déjà connecté */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route path='/nav' element={<Navbar/>}/>
          
          {/* protected routes */}
          <Route
            path='/dash'
            element={
            <ProtectedRoute allowedRoles={["admin","etudiant","prof"]}>
              <DashboardPage />
            </ProtectedRoute>
            }
          />

          {/* Unauthorized */}
          <Route path='/unauthorized' element={<Unauthorized/>}/>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />

          {/* Racine → dashboard si connecté, login sinon */}
          <Route path="/" element={<Navigate to="/dash" replace />} />
      </Routes>
    </div>
  );
}

export default App;

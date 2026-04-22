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
import RoleRedirect from './features/auth/RoleRedirect';

//----------------feautues & layout----------------------
import Navbar from './components/layout/Navbar';
import ChatbotView from './features/chatbot/ChatbotView';
import AdminUsers from './features/admin/AdminUsers';
import AddUserForm from './features/admin/AddUserForm';
import ProfCours from './features/cours/ProfCours'
import ProfUpload from './features/cours/ProfUpload'
import EtudiantCours from './features/cours/EtudiantCours'

import { useAuth } from './context/AuthContext';

function App() {
  const {role} = useAuth();
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
        {/* protected routes */}

        {/* ADMIN */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/create" element={<AddUserForm />} />
        </Route>

        {/* PROF */}
        <Route path="/prof/*" element={
          <ProtectedRoute allowedRoles={["prof"]}>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route path="upload" element={<ProfUpload />} />
          <Route path="cours" element={<ProfCours />} />
        </Route>

        {/* ETUDIANT */}
        <Route path="/etudiant/*" element={
          <ProtectedRoute allowedRoles={["etudiant"]}>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route path="cours" element={<EtudiantCours />} />
        </Route>

        {/* COMMUN */}
        <Route path="/:role/*" element={
          <ProtectedRoute allowedRoles={["admin","etudiant","prof"]}>
            <DashboardPage />
          </ProtectedRoute>
        }>
          <Route path="chat" element={<ChatbotView />} />
        </Route>

        {/* Unauthorized */}
        <Route path='/unauthorized' element={<Unauthorized/>}/>

        {/* Racine → dashboard si connecté, login sinon */}
        <Route path="/" element={<RoleRedirect />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;

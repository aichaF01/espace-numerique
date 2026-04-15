import { Routes, Route } from 'react-router-dom';
import LoginPage from '../src/pages/LoginPage'
import './App.css';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="App">
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} />
          <Route path='/dash' element={<DashboardPage/>}/>
      </Routes>
    </div>
  );
}

export default App;

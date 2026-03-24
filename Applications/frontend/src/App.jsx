import React, { useState } from 'react';
import FacultyDashboard from './components/FacultyDashboard';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  if (!user) {
    if (showRegister) {
      return <Register onRegister={handleLogin} onNavigateToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className="bg-background text-on-background font-body min-h-screen">
      {user.role === 'faculty' 
        ? <FacultyDashboard user={user} onLogout={handleLogout} />
        : <StudentPortal user={user} onLogout={handleLogout} />
      }
    </div>
  );
}

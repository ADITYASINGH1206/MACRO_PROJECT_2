import React, { useState, useEffect } from 'react';
import FacultyDashboard from './components/FacultyDashboard';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';
import Register from './components/Register';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  if (!user) {
    if (showRegister) {
      return <Register onRegister={handleLogin} onNavigateToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setShowRegister(true)} />;
  }

  return (
    <div className={`bg-background text-on-surface font-sans min-h-screen selection:bg-[#c0c1ff]/30 antialiased`}>
      {user.role?.toLowerCase() === 'faculty' 
        ? <FacultyDashboard user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        : <StudentPortal user={user} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      }
    </div>
  );
}

import React, { useState } from 'react';
import FacultyDashboard from './components/FacultyDashboard';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-[#060e20] min-h-screen text-[#dae2fd] font-sans">
      <nav className="bg-[#0b1326] h-16 flex items-center justify-between px-8 border-b border-[#2d3449] sticky top-0 z-50">
        <div className="font-medium text-[1.125rem] tracking-tight flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#8083ff] to-[#c0c1ff] flex items-center justify-center">
                <span className="text-[0.6875rem] font-bold text-[#1000a9] uppercase tracking-[0.05em]">FR</span>
            </div>
            <span>Scholarly Core</span>
        </div>
        
        <div className="flex items-center gap-6">
          <span className="text-[0.875rem] text-[#c7c4d7]">
            Welcome back, <strong className="text-[#dae2fd] font-medium">{user.name}</strong> 
            <span className="ml-2 uppercase tracking-[0.05em] text-[0.6875rem] bg-[#171f33] px-2 py-1 rounded border border-[#2d3449]">
              {user.role}
            </span>
          </span>
          <button 
            onClick={handleLogout}
            className="text-[#ffb4ab] text-[0.875rem] hover:underline font-medium"
          >
            Log out
          </button>
        </div>
      </nav>
      
      <main>
        {user.role === 'faculty' ? <FacultyDashboard user={user} /> : <StudentPortal user={user} />}
      </main>
    </div>
  );
}

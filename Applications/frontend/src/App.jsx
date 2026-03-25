import React, { useState, useEffect } from 'react';
import FacultyDashboard from './components/FacultyDashboard';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';
import Register from './components/Register';
import WelcomeHome from './components/WelcomeHome';
import ManualAttendance from './components/ManualAttendance';
import AttendanceHistoryPro from './components/AttendanceHistoryPro';
import StudentRoster from './components/StudentRoster';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authView, setAuthView] = useState('welcome'); // 'welcome', 'login', 'register'
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'manual', 'history', 'roster'
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [students, setStudents] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (user) {
      if (user.role === 'faculty') {
        fetchStudents();
        fetchAttendanceLogs();
      } else if (user.role === 'admin') {
        // Administration context can be extended here
      }
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/faculty/students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchAttendanceLogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/faculty/attendance-logs');
      const data = await response.json();
      setAttendanceLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    setAuthView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setAuthView('welcome');
    setCurrentView('dashboard');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const markAttendance = async (studentId, status) => {
    try {
      const response = await fetch('http://localhost:3000/api/faculty/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, status }),
      });
      if (response.ok) {
        fetchAttendanceLogs();
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  const handleExportCSV = () => {
    if (attendanceLogs.length === 0) return;
    const headers = ["Student Name", "Email", "Status", "Date"];
    const csvContent = [
      headers.join(","),
      ...attendanceLogs.map(log => [
        log.profiles?.full_name || 'Anonymous',
        log.profiles?.email || 'N/A',
        log.status,
        new Date(log.timestamp || log.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!user) {
    if (authView === 'welcome') {
      return (
        <WelcomeHome 
          onNavigateToLogin={() => setAuthView('login')} 
          onNavigateToRegister={() => setAuthView('register')}
          isDarkMode={isDarkMode}
        />
      );
    }
    if (authView === 'register') {
      return <Register onRegister={handleLogin} onNavigateToLogin={() => setAuthView('login')} isDarkMode={isDarkMode} />;
    }
    return <Login onLogin={handleLogin} onNavigateToRegister={() => setAuthView('register')} isDarkMode={isDarkMode} />;
  }

  // Role Router
  const role = user.role?.toLowerCase();

  if (role === 'admin') {
    if (currentView === 'roster') {
        return <AdminPortal isDarkMode={isDarkMode} onBack={() => setCurrentView('dashboard')} />;
    }
    return (
      <AdminDashboard 
        user={user} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        onNavigateRegistry={() => setCurrentView('roster')}
      />
    );
  }

  if (role === 'faculty') {
    if (currentView === 'manual') {
      return (
        <ManualAttendance 
          students={students} 
          onMarkAttendance={markAttendance} 
          isDarkMode={isDarkMode} 
          onBack={() => setCurrentView('dashboard')} 
        />
      );
    }
    if (currentView === 'history') {
      return (
        <AttendanceHistoryPro 
          attendanceLogs={attendanceLogs} 
          onExportCSV={handleExportCSV} 
          isDarkMode={isDarkMode} 
          onBack={() => setCurrentView('dashboard')} 
        />
      );
    }
    if (currentView === 'roster') {
      return (
        <StudentRoster 
          students={students} 
          attendanceLogs={attendanceLogs}
          isDarkMode={isDarkMode} 
          onBack={() => setCurrentView('dashboard')} 
        />
      );
    }
    return (
      <FacultyDashboard 
        user={user} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme}
        students={students}
        attendanceLogs={attendanceLogs}
        onNavigateManual={() => setCurrentView('manual')}
        onNavigateHistory={() => setCurrentView('history')}
        onNavigateRoster={() => setCurrentView('roster')}
        onMarkAttendance={markAttendance}
        onExportCSV={handleExportCSV}
      />
    );
  }

  return (
    <StudentPortal 
      user={user} 
      onLogout={handleLogout} 
      isDarkMode={isDarkMode} 
      toggleTheme={toggleTheme} 
    />
  );
}

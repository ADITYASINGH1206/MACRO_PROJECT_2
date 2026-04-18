import React, { useState, useEffect } from 'react';
import FacultyDashboard from './components/FacultyDashboard';
import StudentPortal from './components/StudentPortal';
import Login from './components/Login';
import Register from './components/Register';
import WelcomeHome from './components/WelcomeHome';
import ManualAttendance from './components/ManualAttendance';
import AttendanceHistoryPro from './components/AttendanceHistoryPro';
import StudentRoster from './components/StudentRoster';
import AdminDashboard from './components/AdminDashboard';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authView, setAuthView] = useState('welcome'); // 'welcome', 'login', 'register'
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'manual', 'history', 'roster'
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [students, setStudents] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rosterFilter, setRosterFilter] = useState(null);

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
        fetchCourses();
      } else if (user.role === 'admin') {
        // Administration context can be extended here
      }
    }
  }, [user]);

  const fetchAttendanceLogs = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/faculty/attendance-logs?faculty_id=${user.id}`);
      const data = await response.json();
      setAttendanceLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setAttendanceLogs([]);
    }
  };

  const fetchStudents = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/faculty/students?faculty_id=${user.id}`);
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setStudents([]);
    }
  };

  const fetchCourses = async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(`http://localhost:3000/api/faculty/courses/${user.id}`);
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setCourses([]);
    }
  };

  const fetchData = () => {
    if (user?.role === 'faculty') {
      fetchStudents();
      fetchAttendanceLogs();
      fetchCourses();
    }
  };

  const handleLogin = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    window.localStorage.setItem('user_id', userData?.id || '');
    setAuthView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setAuthView('welcome');
    setCurrentView('dashboard');
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const markAttendance = async (studentId, status, courseId) => {
    try {
      const response = await fetch('http://localhost:3000/api/faculty/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, status, course_id: courseId }),
      });
      if (response.ok) {
        fetchAttendanceLogs();
      }
    } catch (err) {
      console.error('Error marking attendance:', err);
    }
  };

  const markBulkAttendance = async (records) => {
    try {
      const response = await fetch('http://localhost:3000/api/faculty/mark-bulk-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendanceRecords: records }),
      });
      if (response.ok) {
        fetchAttendanceLogs();
      }
    } catch (err) {
      console.error('Error marking bulk attendance:', err);
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
      return <Register 
        onRegister={handleLogin} 
        onNavigateToLogin={() => setAuthView('login')} 
        onBack={() => setAuthView('welcome')}
        isDarkMode={isDarkMode} 
      />;
    }
    return <Login 
      onLogin={handleLogin} 
      onNavigateToRegister={() => setAuthView('register')} 
      onBack={() => setAuthView('welcome')}
      isDarkMode={isDarkMode} 
    />;
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
        onNavigateRoster={() => setCurrentView('roster')}
      />
    );
  }

  if (role === 'faculty') {
    const filteredStudents = rosterFilter 
      ? students.filter(s => s.course_id === rosterFilter)
      : students;

    if (currentView === 'manual') {
      return (
        <ManualAttendance 
          students={students} 
          courses={courses}
          onMarkBulkAttendance={markBulkAttendance} 
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
      const activeCourseName = rosterFilter 
        ? courses.find(c => c.id === rosterFilter)?.name 
        : null;
      return (
        <StudentRoster 
          students={filteredStudents} 
          attendanceLogs={attendanceLogs}
          isDarkMode={isDarkMode} 
          title={activeCourseName}
          onBack={() => {
            setRosterFilter(null);
            setCurrentView('dashboard');
          }} 
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
        courses={courses}
        onNavigateManual={() => { setRosterFilter(null); setCurrentView('manual'); }}
        onNavigateHistory={() => { setRosterFilter(null); setCurrentView('history'); }}
        onNavigateRoster={(courseId = null) => { 
          setRosterFilter(courseId); 
          setCurrentView('roster'); 
        }}
        onMarkAttendance={markAttendance}
        onExportCSV={handleExportCSV}
        onRefreshStudents={fetchData}
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

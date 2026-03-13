import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={token ? <DashboardPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/attendance"
          element={token ? <AttendancePage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;

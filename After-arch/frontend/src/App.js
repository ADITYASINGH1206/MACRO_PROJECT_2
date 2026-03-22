import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AttendancePage from './pages/AttendancePage';
import './App.css';

const { Content } = Layout;

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Layout style={{ minHeight: '100vh', background: '#f5f7fa' }}>
        {token && <Navbar />}
        <Content style={{ padding: token ? '24px 50px' : '0' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={token ? <DashboardPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/attendance"
              element={token ? <AttendancePage /> : <Navigate to="/login" />}
            />
            <Route path="/home" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
            <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}


export default App;

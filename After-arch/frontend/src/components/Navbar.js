import React from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  CheckCircleOutlined, 
  LogoutOutlined,
  UserOutlined 
} from '@ant-design/icons';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!token) return null;

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard'),
    },
    {
      key: '/attendance',
      icon: <CheckCircleOutlined />,
      label: 'Attendance',
      onClick: () => navigate('/attendance'),
    },
  ];

  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ 
          fontWeight: 'bold', 
          fontSize: '1.2rem', 
          marginRight: '32px',
          color: '#1890ff'
        }}>
          🎯 AttendEase
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderBottom: 'none', minWidth: '300px' }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserOutlined style={{ color: '#8c8c8c' }} />
          <Text strong>{user.name || 'User'}</Text>
          <Text type="secondary" style={{ fontSize: '0.8rem' }}>({user.role})</Text>
        </div>
        <Button 
          type="text" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
          danger
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;

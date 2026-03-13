import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/services';
import '../styles/Auth.css';

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await authAPI.login(values.email, values.password);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Card title="Login" style={{ width: 400 }}>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default LoginPage;

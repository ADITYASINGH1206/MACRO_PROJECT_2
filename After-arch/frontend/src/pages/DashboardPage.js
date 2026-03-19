import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Statistic, Row, Col, Spin, message, Form, Input, Button, Table, Avatar, Space } from 'antd';
import { attendanceAPI, studentAPI } from '../api/services';

function DashboardPage() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [teacherLoading, setTeacherLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        if (user.role === 'student') {
          const response = await attendanceAPI.getSummary(user.id, '1');
          setAttendanceData(response.data);
        } else {
          setTeacherLoading(true);
          const result = await studentAPI.getAll();
          setStudents(result.data.students || []);
          setTeacherLoading(false);
        }
      } catch (err) {
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const addStudent = async (values) => {
    try {
      const newStudent = {
        roll_number: values.roll_number,
        name: values.name,
        email: values.email,
        phone: values.phone,
        department: values.department,
        picture: values.picture || ''
      };
      const response = await studentAPI.create(newStudent);
      setStudents((prev) => [...prev, response.data.student]);
      form.resetFields();
      message.success('Student added successfully');
    } catch (err) {
      message.error('Unable to add student');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (user.role === 'teacher') {
    const columns = [
      {
        title: 'Photo',
        dataIndex: 'picture',
        key: 'picture',
        render: (url) => (
          <Avatar size={40} src={url || 'https://via.placeholder.com/150'} />
        )
      },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Roll Number', dataIndex: 'roll_number', key: 'roll_number' },
      { title: 'Email', dataIndex: 'email', key: 'email' },
      { title: 'Department', dataIndex: 'department', key: 'department' }
    ];

    return (
      <div className="dashboard-container" style={{ padding: 24 }}>
        <h1>Teacher Dashboard</h1>
        <p>Welcome, {user.name}!</p>

        <Card style={{ marginBottom: 24 }}>
          <Statistic title="Total Students" value={students.length} />
        </Card>

        <Card title="Add Student" style={{ marginBottom: 24 }}>
          <Form layout="vertical" onFinish={addStudent} form={form}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter student name' }]}
                >
                  <Input placeholder="Student name" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Roll Number"
                  name="roll_number"
                  rules={[{ required: true, message: 'Please enter roll number' }]}
                >
                  <Input placeholder="Roll number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Email" name="email" rules={[{ type: 'email', required: true }]}>
                  <Input placeholder="student@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Phone" name="phone">
                  <Input placeholder="Phone number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Department" name="department">
                  <Input placeholder="Department" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Picture URL" name="picture">
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>
            </Row>
            <Space>
              <Button type="primary" htmlType="submit">
                Add Student
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form>
        </Card>

        <Card title="Students List">
          <Table
            columns={columns}
            dataSource={students.map((s) => ({ key: s.id || s.roll_number, ...s }))}
            loading={teacherLoading}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="dashboard-container" style={{ padding: 24 }}>
      <h1>Student Attendance Dashboard</h1>
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Classes" value={attendanceData?.total} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Present" value={attendanceData?.present} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Absent" value={attendanceData?.absent} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Percentage" value={attendanceData?.percentage} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;

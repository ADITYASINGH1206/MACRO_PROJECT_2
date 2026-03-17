import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Statistic, Row, Col, Spin, message } from 'antd';
import { attendanceAPI } from '../api/services';

function DashboardPage() {
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await attendanceAPI.getSummary(user.id, '1'); // Replace with actual course ID
        setAttendanceData(response.data);
      } catch (err) {
        message.error('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  return (
    <div className="dashboard-container" style={{ padding: 24 }}>
      <h1>Attendance Dashboard</h1>
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

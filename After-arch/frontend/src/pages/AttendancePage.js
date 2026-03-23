import React, { useState, useEffect } from 'react';
import { Upload, Button, Spin, Table, message, Card, Row, Col, Statistic, Tag } from 'antd';
import { UploadOutlined, CameraOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { attendanceAPI } from '../api/services';
import WebcamCapture from '../components/WebcamCapture';
import '../styles/Attendance.css';

function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [liveAttendanceStats, setLiveAttendanceStats] = useState({
    totalDetections: 0,
    markedToday: 0,
    lastMarked: null,
  });
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(false);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const courseId = '1'; // Replace with actual course ID, perhaps fetched from user context

  useEffect(() => {
    // Optionally fetch initial attendance records for today when component mounts
    const fetchInitialRecords = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const response = await attendanceAPI.getRecords(courseId, today, today);
        setRecords(response.data.records);
        setLiveAttendanceStats(prev => ({ ...prev, markedToday: response.data.records.length }));
      } catch (err) {
        message.error('Failed to load initial attendance records.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialRecords();
  }, [courseId]);

  const handleCapture = async (imageSrc) => {
    if (isProcessingFrame) return; // Prevent multiple captures from overlapping processing

    setIsProcessingFrame(true);
    try {
      const base64Image = imageSrc.split(',')[1]; // Remove "data:image/jpeg;base64,"

      const formData = new FormData();
      formData.append('image', base64Image);
      formData.append('course_id', courseId);
      formData.append('user_id', user.id); // Pass the current user's ID if needed for ML service

      const response = await attendanceAPI.detect(formData, true); // True indicates base64 upload
      message.success(`Detected ${response.data.detectionsCount} faces, marked attendance for ${response.data.attendanceMarked} students.`);
      
      // Update records and live stats
      if (response.data.records && response.data.records.length > 0) {
        setRecords(prev => {
          const newRecords = [...prev];
          response.data.records.forEach(newRec => {
            if (!newRecords.some(existingRec => existingRec.id === newRec.id)) {
              newRecords.push(newRec);
            }
          });
          return newRecords;
        });

        setLiveAttendanceStats(prev => ({
          ...prev,
          totalDetections: prev.totalDetections + response.data.detectionsCount,
          markedToday: prev.markedToday + response.data.attendanceMarked,
          lastMarked: new Date().toLocaleTimeString(),
        }));
      } else {
        setLiveAttendanceStats(prev => ({ ...prev, totalDetections: prev.totalDetections + response.data.detectionsCount }));
      }
    } catch (err) {
      console.error("Error during live attendance capture:", err);
      message.error(err.response?.data?.error || 'Live detection failed');
    } finally {
      setIsProcessingFrame(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('course_id', courseId);
      formData.append('user_id', user.id);

      const response = await attendanceAPI.detect(formData);
      message.success(`Detected ${response.data.detectionsCount} faces, marked attendance for ${response.data.attendanceMarked} students`);
      
      // Refresh records after manual upload
      const today = new Date().toISOString().split('T')[0];
      const updatedRecords = await attendanceAPI.getRecords(courseId, today, today);
      setRecords(updatedRecords.data.records);
      setLiveAttendanceStats(prev => ({ ...prev, markedToday: updatedRecords.data.records.length }));

    } catch (err) {
      message.error(err.response?.data?.error || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Student Name',
      dataIndex: ['students', 'name'],
      key: 'student_name',
      render: (text) => text || 'N/A'
    },
    {
      title: 'Student ID',
      dataIndex: 'student_id',
      key: 'student_id'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => new Date(time).toLocaleTimeString()
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'present' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence) => `${(confidence * 100).toFixed(2)}%`
    }
  ];

  return (
    <div className="attendance-container">
      <h2>Mark Attendance</h2>

      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Total Detections (Session)" value={liveAttendanceStats.totalDetections} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Students Marked Today" value={liveAttendanceStats.markedToday} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card>
            <Statistic title="Last Marked At" value={liveAttendanceStats.lastMarked || 'N/A'} />
          </Card>
        </Col>
      </Row>

      <Card title="Attendance Options" style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Upload
              beforeUpload={(file) => {
                handleFileUpload(file);
                return false; 
              }}
              accept="image/*"
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} disabled={loading || isLiveFeedActive}>
                Upload Image for Detection
              </Button>
            </Upload>
          </Col>
          <Col>
            <Button 
              type={isLiveFeedActive ? "danger" : "primary"}
              icon={isLiveFeedActive ? <CloseCircleOutlined /> : <CameraOutlined />}
              onClick={() => setIsLiveFeedActive(!isLiveFeedActive)}
              disabled={loading}
            >
              {isLiveFeedActive ? "Stop Live Attendance" : "Start Live Attendance"}
            </Button>
          </Col>
        </Row>
      </Card>

      {isLiveFeedActive && (
        <WebcamCapture onCapture={handleCapture} processing={isProcessingFrame} />
      )}

      {loading && <Spin style={{ marginTop: 20 }} tip="Processing..." />}

      {records.length > 0 && (
        <Table
          columns={columns}
          dataSource={records}
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 10 }}
          rowKey="id"
        />
      )}
    </div>
  );
}

export default AttendancePage;

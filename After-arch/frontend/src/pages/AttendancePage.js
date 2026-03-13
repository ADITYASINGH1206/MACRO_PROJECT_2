import React, { useState } from 'react';
import { Upload, Button, Spin, Table, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { attendanceAPI } from '../api/services';
import '../styles/Attendance.css';

function AttendancePage() {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);

  const handleUpload = async (file) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('course_id', '1'); // Replace with actual course ID
      formData.append('user_id', '1'); // Replace with actual user ID

      const response = await attendanceAPI.detect(formData);
      message.success(`Attendance marked for ${response.data.attendanceMarked} students`);
      setRecords(response.data.records);
    } catch (err) {
      message.error(err.response?.data?.error || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
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
      key: 'time'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
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
      <Upload
        beforeUpload={(file) => {
          handleUpload(file);
          return false;
        }}
        accept="image/*"
      >
        <Button icon={<UploadOutlined />} disabled={loading}>
          Upload Image for Detection
        </Button>
      </Upload>

      {loading && <Spin style={{ marginTop: 20 }} tip="Processing..." />}

      {records.length > 0 && (
        <Table
          columns={columns}
          dataSource={records}
          style={{ marginTop: 20 }}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
}

export default AttendancePage;

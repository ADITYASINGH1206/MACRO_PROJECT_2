import React, { useRef, useEffect, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Row, Col, Card, Statistic, Alert } from 'antd';
import { CameraOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: 'user',
};

function WebcamCapture({ onCapture, processing }) {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
      }
    }
  }, [onCapture]);

  useEffect(() => {
    let interval;
    if (isCapturing) {
      interval = setInterval(() => {
        if (!processing) { // Only capture if not currently processing a frame
          capture();
        }
      }, 1000); // Capture every 1 second
    }
    return () => clearInterval(interval);
  }, [isCapturing, capture, processing]);

  const handleStartCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(videoConstraints);
      if (stream) {
        setIsCapturing(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing webcam: ", err);
      setError("Failed to access webcam. Please ensure it's connected and permissions are granted.");
      setIsCapturing(false);
    }
  };

  const handleStopCapture = () => {
    setIsCapturing(false);
  };

  return (
    <Card
      title="Live Camera Feed"
      style={{ marginBottom: 20 }}
      extra={
        <>
          {isCapturing ? (
            <Button
              type="primary"
              danger
              icon={<PauseCircleOutlined />}
              onClick={handleStopCapture}
              disabled={processing}
            >
              Stop Feed
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartCapture}
              disabled={processing}
            >
              Start Feed
            </Button>
          )}
        </>
      }
    >
      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          mirrored={true}
          style={{ width: '100%', maxWidth: '640px', borderRadius: '8px', border: '1px solid #e8e8e8' }}
        />
        {processing && <p style={{ marginTop: 10, color: '#1890ff' }}>Processing frame...</p>}
      </div>
    </Card>
  );
}

WebcamCapture.propTypes = {
  onCapture: PropTypes.func.isRequired,
  processing: PropTypes.bool,
};

WebcamCapture.defaultProps = {
  processing: false,
};

export default WebcamCapture;

const express = require('express');
const router = express.Router();
const axios = require('axios');
const supabase = require('../config/supabase');
const fs = require('fs');

// Python ML service endpoint (running locally)
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Detect faces in image and mark attendance
router.post('/detect', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imagePath = req.file.path;
    const userId = req.body.user_id;
    const courseId = req.body.course_id;

    // Read image file
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    // Send to Python ML service
    const mlResponse = await axios.post(`${ML_SERVICE_URL}/detect`, {
      image: base64Image,
      image_name: req.file.filename
    });

    const detections = mlResponse.data.detections || [];

    // Process detections and create attendance records
    const attendanceRecords = [];
    for (const detection of detections) {
      const { student_id, confidence } = detection;

      if (confidence > 0.7) { // Confidence threshold
        // Check if attendance already marked today
        const today = new Date().toISOString().split('T')[0];
        const { data, error } = await supabase
          .from('attendance')
          .select('*')
          .eq('student_id', student_id)
          .eq('course_id', courseId)
          .eq('date', today)
          .single();

        if (!data) {
          // Mark attendance
          const { data: newRecord, error: insertError } = await supabase
            .from('attendance')
            .insert([
              {
                student_id,
                course_id: courseId,
                date: today,
                time: new Date().toISOString(),
                status: 'present',
                confidence,
                image_url: imagePath
              }
            ])
            .select();

          if (!insertError) {
            attendanceRecords.push(newRecord[0]);
          }
        }
      }
    }

    // Clean up uploaded file
    fs.unlinkSync(imagePath);

    res.json({
      message: 'Detection and attendance completed',
      detectionsCount: detections.length,
      attendanceMarked: attendanceRecords.length,
      records: attendanceRecords
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get attendance records
router.get('/records/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('attendance')
      .select(`
        id,
        student_id,
        date,
        time,
        status,
        confidence,
        students:student_id(name, email)
      `)
      .eq('course_id', courseId);

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ records: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get attendance summary for a student
router.get('/summary/:studentId/:courseId', async (req, res) => {
  try {
    const { studentId, courseId } = req.params;

    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_id', courseId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const total = data.length;
    const present = data.filter((r) => r.status === 'present').length;
    const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

    res.json({
      studentId,
      courseId,
      total,
      present,
      absent: total - present,
      percentage: `${percentage}%`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

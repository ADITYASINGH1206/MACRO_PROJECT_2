const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Placeholder for detection routes
router.get('/', (req, res) => {
  res.json({ message: 'Detection routes' });
});

router.post('/detect', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    const mlResponse = await axios.post(`${ML_SERVICE_URL}/detect`, {
      image: base64Image,
      image_name: req.file.filename
    });

    fs.unlinkSync(imagePath); // Clean up the uploaded file

    res.json(mlResponse.data);
  } catch (err) {
    console.error('Error in /api/detection/detect:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

module.exports = router;

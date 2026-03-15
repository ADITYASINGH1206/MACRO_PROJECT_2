const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();
const supabase = require('./config/supabase');

// Import routes
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');
const detectionRoutes = require('./routes/detection');
const studentRoutes = require('./routes/students');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/detection', upload.single('image'), detectionRoutes);
app.use('/api/students', studentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .limit(1);

    if (error) {
      console.warn('Supabase connection check warning:', error.message);
    } else {
      console.log('Supabase connected successfully. Rows checked:', data.length);
    }
  } catch (err) {
    console.error('Supabase connection check failed:', err.message || err);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();

module.exports = app;

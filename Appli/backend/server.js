import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Load Routes
import attendanceRoutes from './routes/attendance.js';
import coursesRoutes from './routes/courses.js';

// API Endpoints
app.use('/api/attendance', attendanceRoutes);
app.use('/api/courses', coursesRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.send('Facial Recognition Attendance API is running.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

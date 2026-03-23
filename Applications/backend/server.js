import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Modular ES Routes
import authRoutes from './src/routes/authRoutes.js';
import attendanceRoutes from './src/routes/attendanceRoutes.js';
import facultyRoutes from './src/routes/facultyRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API Gateways
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/faculty', facultyRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'healthy', message: 'Modular Backend API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[SYSTEM] Attendance API Gateway running securely on port ${PORT}`);
    console.log('[SYSTEM] Strict ES Modules architecture is active.');
});

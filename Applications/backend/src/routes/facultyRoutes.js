import express from 'express';
import { addStudent } from '../controllers/facultyController.js';

const router = express.Router();

router.post('/add-student', addStudent);

export default router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const supabase = require('../config/supabase');

const uploadDir = path.join(__dirname, '..', 'uploads', 'students');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});

const upload = multer({ storage });

// Get all students
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ students: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ student: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create student
router.post('/', async (req, res) => {
  try {
    const { roll_number, name, email, phone, department, picture } = req.body;

    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          roll_number,
          name,
          email,
          phone,
          department,
          picture
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ student: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload student with picture file
router.post('/upload', upload.single('picture'), async (req, res) => {
  try {
    const { roll_number, name, email, phone, department } = req.body;
    const pictureUrl = req.file
      ? `${req.protocol}://${req.get('host')}/uploads/students/${req.file.filename}`
      : null;

    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          roll_number,
          name,
          email,
          phone,
          department,
          picture: pictureUrl
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ student: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
router.put('/:id', async (req, res) => {
  try {
    const { roll_number, name, email, phone, department, picture } = req.body;

    const { data, error } = await supabase
      .from('students')
      .update({
        roll_number,
        name,
        email,
        phone,
        department,
        picture
      })
      .eq('id', req.params.id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ student: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

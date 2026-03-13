const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

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
    const { roll_number, name, email, phone, department } = req.body;

    const { data, error } = await supabase
      .from('students')
      .insert([
        {
          roll_number,
          name,
          email,
          phone,
          department
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
    const { roll_number, name, email, phone, department } = req.body;

    const { data, error } = await supabase
      .from('students')
      .update({
        roll_number,
        name,
        email,
        phone,
        department
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

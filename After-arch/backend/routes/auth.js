const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          name,
          role: role || 'student'
        }
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: data[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, data.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: data.id, email: data.email, role: data.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;

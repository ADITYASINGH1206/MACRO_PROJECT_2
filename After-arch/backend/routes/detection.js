const express = require('express');
const router = express.Router();

// Placeholder for detection routes
router.get('/', (req, res) => {
  res.json({ message: 'Detection routes' });
});

module.exports = router;

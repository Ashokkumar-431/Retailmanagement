const express = require('express');
const router = express.Router();
const db = require('../db');

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }
  const sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const user = results[0];
    req.session.user = { id: user.user_id, username: user.username, role: user.role };
    res.json({ success: true, user: { username: user.username, role: user.role } });
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true, message: 'Logged out' });
});

// Check session
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
});

module.exports = router;

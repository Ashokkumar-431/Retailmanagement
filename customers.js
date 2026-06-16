const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Customers ORDER BY name', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Customers WHERE customer_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, data: results[0] });
  });
});

router.post('/', (req, res) => {
  const { name, balance } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
  db.query('INSERT INTO Customers (name, balance) VALUES (?, ?)', [name, balance || 0], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Customer added', id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  const { name, balance } = req.body;
  db.query('UPDATE Customers SET name=?, balance=? WHERE customer_id=?',
    [name, balance, req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Customer updated' });
    });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Customers WHERE customer_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Customer deleted' });
  });
});

module.exports = router;

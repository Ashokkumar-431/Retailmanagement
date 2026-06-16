const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM Suppliers ORDER BY name', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { name, contact } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
  db.query('INSERT INTO Suppliers (name, contact) VALUES (?, ?)', [name, contact || ''], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Supplier added', id: result.insertId });
  });
});

router.put('/:id', (req, res) => {
  const { name, contact } = req.body;
  db.query('UPDATE Suppliers SET name=?, contact=? WHERE supplier_id=?',
    [name, contact, req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Supplier updated' });
    });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Suppliers WHERE supplier_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Supplier deleted' });
  });
});

module.exports = router;

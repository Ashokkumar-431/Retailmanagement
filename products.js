const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all products
router.get('/', (req, res) => {
  db.query('SELECT * FROM Products ORDER BY category, name', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Get product by id
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Products WHERE product_id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: results[0] });
  });
});

// Add product
router.post('/', (req, res) => {
  const { name, category, price } = req.body;
  if (!name || !category || !price) return res.status(400).json({ success: false, message: 'All fields required' });
  db.query('INSERT INTO Products (name, category, price) VALUES (?, ?, ?)', [name, category, price], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    // Also insert into Stock with 0 quantity
    db.query('INSERT INTO Stock (product_id, available_quantity) VALUES (?, 0)', [result.insertId], () => {});
    res.json({ success: true, message: 'Product added', id: result.insertId });
  });
});

// Update product
router.put('/:id', (req, res) => {
  const { name, category, price } = req.body;
  db.query('UPDATE Products SET name=?, category=?, price=? WHERE product_id=?',
    [name, category, price, req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Product updated' });
    });
});

// Delete product
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Products WHERE product_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Product deleted' });
  });
});

module.exports = router;

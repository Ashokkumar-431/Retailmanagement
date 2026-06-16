const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT pu.purchase_id, s.name AS supplier_name, p.name AS product_name,
           pu.quantity, pu.cost, pu.date
    FROM Purchases pu
    JOIN Suppliers s ON pu.supplier_id = s.supplier_id
    JOIN Products p ON pu.product_id = p.product_id
    ORDER BY pu.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

router.post('/', (req, res) => {
  const { supplier_id, product_id, quantity, cost, date } = req.body;
  if (!supplier_id || !product_id || !quantity || !cost || !date)
    return res.status(400).json({ success: false, message: 'All fields required' });

  db.query('INSERT INTO Purchases (supplier_id, product_id, quantity, cost, date) VALUES (?, ?, ?, ?, ?)',
    [supplier_id, product_id, quantity, cost, date], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: err.message });

      // Add to stock
      db.query('UPDATE Stock SET available_quantity = available_quantity + ? WHERE product_id = ?',
        [quantity, product_id], () => {});

      res.json({ success: true, message: 'Purchase recorded', id: result.insertId });
    });
});

router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Purchases WHERE purchase_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Purchase deleted' });
  });
});

module.exports = router;

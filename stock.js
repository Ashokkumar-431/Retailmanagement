const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT st.product_id, p.name, p.category, p.price, st.available_quantity,
           (p.price * st.available_quantity) AS stock_value
    FROM Stock st
    JOIN Products p ON st.product_id = p.product_id
    ORDER BY p.category, p.name
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

router.put('/:id', (req, res) => {
  const { available_quantity } = req.body;
  db.query('UPDATE Stock SET available_quantity = ? WHERE product_id = ?',
    [available_quantity, req.params.id], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.json({ success: true, message: 'Stock updated' });
    });
});

module.exports = router;

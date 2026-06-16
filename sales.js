const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all sales with product name
router.get('/', (req, res) => {
  const sql = `
    SELECT s.sale_id, p.name AS product_name, p.price, s.quantity,
           (p.price * s.quantity) AS subtotal,
           s.gst,
           ROUND((p.price * s.quantity) * s.gst / 100, 2) AS gst_amount,
           ROUND((p.price * s.quantity) + (p.price * s.quantity) * s.gst / 100, 2) AS total,
           s.date
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    ORDER BY s.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Add sale
router.post('/', (req, res) => {
  const { product_id, quantity, date, gst } = req.body;
  if (!product_id || !quantity || !date) return res.status(400).json({ success: false, message: 'All fields required' });

  // Check stock
  db.query('SELECT available_quantity FROM Stock WHERE product_id = ?', [product_id], (err, stock) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!stock.length || stock[0].available_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    db.query('INSERT INTO Sales (product_id, quantity, date, gst) VALUES (?, ?, ?, ?)',
      [product_id, quantity, date, gst || 0], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        // Deduct from stock
        db.query('UPDATE Stock SET available_quantity = available_quantity - ? WHERE product_id = ?',
          [quantity, product_id], () => {});

        // Add GST report entry
        db.query('SELECT price FROM Products WHERE product_id = ?', [product_id], (err, prod) => {
          if (!err && prod.length) {
            const taxAmount = (prod[0].price * quantity * (gst || 0)) / 100;
            db.query('INSERT INTO GST_Report (transaction_id, tax_amount) VALUES (?, ?)',
              [result.insertId, taxAmount.toFixed(2)], () => {});
          }
        });

        res.json({ success: true, message: 'Sale recorded', id: result.insertId });
      });
  });
});

// Delete sale
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Sales WHERE sale_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Sale deleted' });
  });
});

module.exports = router;

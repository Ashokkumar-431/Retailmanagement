const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT g.gst_id, g.transaction_id, s.date, p.name AS product_name,
           s.quantity, s.gst AS gst_rate, g.tax_amount
    FROM GST_Report g
    JOIN Sales s ON g.transaction_id = s.sale_id
    JOIN Products p ON s.product_id = p.product_id
    ORDER BY s.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

router.get('/summary', (req, res) => {
  const sql = `
    SELECT 
      SUM(tax_amount) AS total_gst,
      COUNT(*) AS total_transactions
    FROM GST_Report
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results[0] });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/summary', (req, res) => {
  const queries = {
    totalProducts: 'SELECT COUNT(*) AS count FROM Products',
    totalCustomers: 'SELECT COUNT(*) AS count FROM Customers',
    totalSuppliers: 'SELECT COUNT(*) AS count FROM Suppliers',
    totalSales: 'SELECT COUNT(*) AS count, SUM(p.price * s.quantity) AS revenue FROM Sales s JOIN Products p ON s.product_id = p.product_id',
    totalPurchases: 'SELECT COUNT(*) AS count, SUM(cost * quantity) AS spend FROM Purchases',
    totalGST: 'SELECT SUM(tax_amount) AS total FROM GST_Report',
    lowStock: 'SELECT COUNT(*) AS count FROM Stock WHERE available_quantity < 20',
    stockValue: 'SELECT SUM(p.price * st.available_quantity) AS value FROM Stock st JOIN Products p ON st.product_id = p.product_id'
  };

  const results = {};
  const keys = Object.keys(queries);
  let done = 0;

  keys.forEach(key => {
    db.query(queries[key], (err, rows) => {
      if (!err) results[key] = rows[0];
      done++;
      if (done === keys.length) {
        res.json({ success: true, data: results });
      }
    });
  });
});

// Sales trend last 30 days
router.get('/sales-trend', (req, res) => {
  const sql = `
    SELECT DATE(s.date) AS date, 
           SUM(p.price * s.quantity) AS revenue,
           COUNT(*) AS transactions
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    WHERE s.date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY DATE(s.date)
    ORDER BY date ASC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Top selling products
router.get('/top-products', (req, res) => {
  const sql = `
    SELECT p.name, p.category, SUM(s.quantity) AS total_qty,
           SUM(p.price * s.quantity) AS total_revenue
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    GROUP BY s.product_id
    ORDER BY total_qty DESC
    LIMIT 10
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

// Sales by category
router.get('/category-sales', (req, res) => {
  const sql = `
    SELECT p.category, SUM(s.quantity) AS total_qty,
           SUM(p.price * s.quantity) AS total_revenue
    FROM Sales s
    JOIN Products p ON s.product_id = p.product_id
    GROUP BY p.category
    ORDER BY total_revenue DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, data: results });
  });
});

module.exports = router;

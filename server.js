const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: 'retail_secret_key_2024',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Auth middleware for API routes
function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
}

function requireAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin access required.' });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', requireAuth, require('./routes/products'));
app.use('/api/customers', requireAuth, require('./routes/customers'));
app.use('/api/suppliers', requireAuth, require('./routes/suppliers'));
app.use('/api/sales', requireAuth, require('./routes/sales'));
app.use('/api/purchases', requireAuth, require('./routes/purchases'));
app.use('/api/stock', requireAuth, require('./routes/stock'));
app.use('/api/gst', requireAuth, require('./routes/gst'));
app.use('/api/dashboard', requireAuth, require('./routes/dashboard'));

// Serve index (login page)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Retail Management Server running at http://localhost:${PORT}`);
  console.log(`📋 Login with admin/1234 or staff1/1234`);
});

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Change to your MySQL username
  password: 'M.Ashok@2007',        // Change to your MySQL password
  database: 'retail_management'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database: retail_management');
});

module.exports = db;

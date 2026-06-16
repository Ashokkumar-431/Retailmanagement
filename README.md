# 🛒 RetailPro — Retail Management System

## Project Structure

```
retail_management/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── customers.js
│   │   ├── suppliers.js
│   │   ├── sales.js
│   │   ├── purchases.js
│   │   ├── stock.js
│   │   ├── gst.js
│   │   └── dashboard.js
│   ├── db.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── app.js
    ├── pages/
    │   ├── dashboard.html
    │   ├── products.html
    │   ├── stock.html
    │   ├── sales.html
    │   ├── purchases.html
    │   ├── customers.html
    │   ├── suppliers.html
    │   └── gst.html
    └── login.html
```

---

## ⚙️ Setup Instructions

### Step 1 — MySQL Setup
1. Open **MySQL Workbench** or your MySQL client
2. Run the SQL script provided (`database.sql`) to create the database, tables, and seed data
3. Make sure MySQL server is running on `localhost:3306`

### Step 2 — Configure Database
Open `backend/db.js` and update your MySQL credentials:
```js
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // your MySQL username
  password: '',       // your MySQL password
  database: 'retail_management'
});
```

### Step 3 — Install Dependencies
Open terminal in VS Code, navigate to `backend/`:
```bash
cd backend
npm install
```

### Step 4 — Start the Server
```bash
npm start
# or for auto-reload during development:
npm run dev
```

### Step 5 — Open in Browser
Visit: **http://localhost:3000**

---

## 🔐 Login Credentials

| Role  | Username | Password | Access |
|-------|----------|----------|--------|
| Admin | admin    | 1234     | Full access to all modules |
| Staff | staff1   | 1234     | Dashboard, Products, Stock, Sales, Purchases, Customers |

**Admin-only pages:** Suppliers, GST Report, Delete operations

---

## 📋 Features

| Module       | Admin | Staff |
|--------------|-------|-------|
| Dashboard    | ✅    | ✅    |
| Products     | CRUD  | Read + Edit |
| Stock        | ✅    | ✅    |
| Sales        | CRUD  | Add + View |
| Purchases    | CRUD  | Add + View |
| Customers    | CRUD  | Add + Edit |
| Suppliers    | CRUD  | ❌    |
| GST Report   | ✅    | ❌    |

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, express-session
- **Database:** MySQL (mysql2)
- **Frontend:** Vanilla HTML/CSS/JavaScript
- **Fonts:** Google Fonts (Plus Jakarta Sans + Sora)

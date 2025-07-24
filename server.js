require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db'); // mysql2 pool

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'src')));

// Create tables
const runMigrations = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        mobileNumber VARCHAR(20) UNIQUE,
        name VARCHAR(255),
        role VARCHAR(50) DEFAULT 'customer'
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS providers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        latitude DOUBLE,
        longitude DOUBLE,
        name VARCHAR(255),
        mobileNumber VARCHAR(20) UNIQUE,
        gender VARCHAR(10),
        age INT,
        skills TEXT,
        location TEXT,
        taluk TEXT,
        district TEXT,
        state TEXT,
        role VARCHAR(50) DEFAULT 'provider'
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customerMobile VARCHAR(20),
        providerMobile VARCHAR(20),
        status VARCHAR(50) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bookingId INT,
        customerMobile VARCHAR(20),
        providerMobile VARCHAR(20),
        rating INT,
        comment TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tables ready');
  } catch (err) {
    console.error('❌ Migration error:', err);
  }
};

// ---------- Routes ----------

// Register customer
app.post('/api/register/customer', async (req, res) => {
  const { mobileNumber, name } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO customers (mobileNumber, name) VALUES (?, ?)',
      [mobileNumber, name]
    );
    res.json({ id: result.insertId, mobileNumber, name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Register provider
app.post('/api/register/provider', async (req, res) => {
  const { mobileNumber, name, skills, location, taluk, district, state } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO providers (mobileNumber, name, skills, location, taluk, district, state)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [mobileNumber, name, skills, location, taluk, district, state]
    );
    res.json({ id: result.insertId, mobileNumber, name });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { mobileNumber, userType } = req.body;
  const table = userType === 'provider' ? 'providers' : 'customers';
  try {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE mobileNumber = ?`, [mobileNumber]);
    if (rows.length > 0) {
      res.json({ success: true, user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search providers with filters
app.get('/api/providers', async (req, res) => {
  let sql = `
    SELECT p.*, 
    (SELECT AVG(rating) FROM reviews WHERE providerMobile = p.mobileNumber) as avgRating
    FROM providers p WHERE 1=1
  `;
  const params = [];

  const filters = ['skills', 'location', 'taluk', 'district', 'state'];
  for (const key of filters) {
    if (req.query[key]) {
      sql += ` AND LOWER(p.${key}) LIKE ?`;
      params.push(`%${req.query[key].toLowerCase()}%`);
    }
  }

  if (req.query.minRating) {
    sql += ` HAVING avgRating IS NULL OR avgRating >= ?`;
    params.push(Number(req.query.minRating));
  }

  sql += ` ORDER BY avgRating DESC`;

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create booking
app.post('/api/bookings', async (req, res) => {
  const { providerName, customerMobile, providerMobile } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO bookings (providerName, customerMobile, providerMobile, status) VALUES (?, ?, ?, 'pending')`,
      [providerName, customerMobile, providerMobile]
    );
    res.json({ id: result.insertId, providerName, customerMobile, providerMobile, status: 'pending' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get bookings with names
app.get('/api/bookings', async (req, res) => {
  const { customer, provider } = req.query;
  let sql = '';
  let param = '';
  if (customer) {
    sql = `
      SELECT b.*, p.name as providerName
      FROM bookings b
      LEFT JOIN providers p ON b.providerMobile = p.mobileNumber
      WHERE b.customerMobile = ?
      ORDER BY b.createdAt DESC
    `;
    param = customer;
  } else if (provider) {
    sql = `
      SELECT b.*, c.name as customerName
      FROM bookings b
      LEFT JOIN customers c ON b.customerMobile = c.mobileNumber
      WHERE b.providerMobile = ?
      ORDER BY b.createdAt DESC
    `;
    param = provider;
  } else {
    return res.status(400).json({ error: 'Missing customer or provider parameter' });
  }

  try {
    const [rows] = await pool.query(sql, [param]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Provider responds to booking
app.post('/api/bookings/:id/respond', async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query(`UPDATE bookings SET status = ? WHERE id = ?`, [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit review
app.post('/api/reviews', async (req, res) => {
  const { bookingId, customerMobile, providerMobile, rating, comment } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO reviews (bookingId, customerMobile, providerMobile, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [bookingId, customerMobile, providerMobile, rating, comment]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get reviews (with provider name for customerMobile)
app.get('/api/reviews', async (req, res) => {
  const { provider, customerMobile } = req.query;
  try {
    let sql = '';
    let param = '';
    if (provider) {
      sql = 'SELECT * FROM reviews WHERE providerMobile = ? ORDER BY createdAt DESC';
      param = provider;
    } else if (customerMobile) {
      sql = `
        SELECT r.*, p.name as providerName
        FROM reviews r
        LEFT JOIN providers p ON r.providerMobile = p.mobileNumber
        WHERE r.customerMobile = ?
        ORDER BY r.createdAt DESC
      `;
      param = customerMobile;
    } else {
      return res.status(400).json({ error: 'Missing provider or customerMobile parameter' });
    }

    const [rows] = await pool.query(sql, [param]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get average rating
app.get('/api/providers/:mobile/average-rating', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT AVG(rating) as avgRating FROM reviews WHERE providerMobile = ?',
      [req.params.mobile]
    );
    res.json({ avgRating: rows[0].avgRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unique skills
app.get('/api/skills', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT skills FROM providers WHERE skills IS NOT NULL AND skills != ''`);
    const allSkills = [...new Set(
      rows.flatMap(r => r.skills.split(',').map(s => s.trim()))
    )].sort();
    res.json(allSkills);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Districts
app.get('/api/districts', async (req, res) => {
  const { state } = req.query;
  const sql = state
    ? 'SELECT DISTINCT district FROM providers WHERE LOWER(state) = ? AND district IS NOT NULL AND district != \'\' ORDER BY district'
    : 'SELECT DISTINCT district FROM providers WHERE district IS NOT NULL AND district != \'\' ORDER BY district';
  const params = state ? [state.toLowerCase()] : [];
  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows.map(r => r.district));
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Taluks
app.get('/api/taluks', async (req, res) => {
  const { district } = req.query;
  const sql = district
    ? 'SELECT DISTINCT taluk FROM providers WHERE LOWER(district) = ? AND taluk IS NOT NULL AND taluk != \'\' ORDER BY taluk'
    : 'SELECT DISTINCT taluk FROM providers WHERE taluk IS NOT NULL AND taluk != \'\' ORDER BY taluk';
  const params = district ? [district.toLowerCase()] : [];
  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows.map(r => r.taluk));
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Locations
app.get('/api/locations', async (req, res) => {
  const { state, district, taluk } = req.query;
  let sql = 'SELECT DISTINCT location FROM providers WHERE location IS NOT NULL AND location != \'\'';
  const params = [];

  if (state) {
    sql += ' AND LOWER(state) = ?';
    params.push(state.toLowerCase());
  }
  if (district) {
    sql += ' AND LOWER(district) = ?';
    params.push(district.toLowerCase());
  }
  if (taluk) {
    sql += ' AND LOWER(taluk) = ?';
    params.push(taluk.toLowerCase());
  }

  sql += ' ORDER BY location';

  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows.map(r => r.location));
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// States
app.get('/api/states', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT state FROM providers WHERE state IS NOT NULL AND state != '' ORDER BY state`
    );
    res.json(rows.map(r => r.state));
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

// Customer by mobile
app.get('/api/customers/:mobile', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM customers WHERE mobileNumber = ?',
      [req.params.mobile]
    );
    if (rows.length > 0) return res.json(rows[0]);
    res.status(404).json({ error: 'Customer not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Provider by mobile
app.get('/api/providers/:mobile', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM providers WHERE mobileNumber = ?',
      [req.params.mobile]
    );
    if (rows.length > 0) return res.json(rows[0]);
    res.status(404).json({ error: 'Provider not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer by mobile
app.put('/api/customers/:mobile', async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE customers SET name = ? WHERE mobileNumber = ?',
      [name, req.params.mobile]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update provider by mobile
app.put('/api/providers/:mobile', async (req, res) => {
  const { name, skills, location, taluk, district, state, gender, age } = req.body;
  try {
    const [result] = await pool.query(
      `UPDATE providers SET 
        name = ?, 
        skills = ?, 
        location = ?, 
        taluk = ?, 
        district = ?, 
        state = ?, 
        gender = ?, 
        age = ?
      WHERE mobileNumber = ?`,
      [name, skills, location, taluk, district, state, gender, age, req.params.mobile]
    );
    if (result.affectedRows > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Provider not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start app
runMigrations().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

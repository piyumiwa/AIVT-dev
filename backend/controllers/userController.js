require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
// const { v4: uuidv4 } = require('uuid');

// Signup Admin
exports.singupUser = async (req, res) => {
  const { username, password } = req.body;  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // const id = uuidv4(); // Ensure admins.adminId is UUID

    await pool.query(
      "INSERT INTO admins (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    res.status(201).json({ message: "Admin created" });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: "Signup failed" });
  }
};

// Login Admin
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      id: user.adminid,
      role: 'admin',
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY || '1d',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const result = await pool.query('SELECT adminId AS id, username FROM admins');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current admin (based on JWT)
exports.getCurrentAdmin = async (req, res) => {
  const adminId = req.user?.id;
  try {
    const result = await pool.query('SELECT adminId AS id, username FROM admins WHERE adminId = $1', [adminId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ ...result.rows[0], role: 'admin' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT adminId AS id, username FROM admins WHERE adminId = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../config/database');

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Function to find a user by email
async function findUserByEmail(email) {
    const result = await pool.query('SELECT * FROM Reporter WHERE email = $1', [email]);
    return result.rows[0];
}

exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Reporter');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// A function to find user by ID 
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT reporterId AS id, name, email, organization FROM Reporter WHERE reporterId = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];
        const reportData = {
            id: user.id,
            name: user.name,
            email: user.email,
            organization: user.organization
        };
        res.json(reportData);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Function to submit new email from auth0
exports.createEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { reporterId, email } = req.body;

    try {
        let user = await findUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Corrected SQL query and arguments
        const result = await pool.query(
            'INSERT INTO Reporter (reporterId, email) VALUES ($1, $2) RETURNING *',
            [reporterId, email]
        );
        user = result.rows[0];

        // Log the user object to ensure reporterid exists
        console.log('User object:', user);

        if (!user || !user.reporterid) {
            return res.status(500).json({ message: 'Failed to create user or missing reporterid' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.findUserByEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (userData.rows.length) {
            res.json(userData.rows[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getCurrentUser = async (req, res) => {
    const { sub } = req.query;

  if (!sub) {
    return res.status(400).json({ error: "User should log in." });
  }

  try {
    const result = await pool.query("SELECT * FROM Reporter WHERE reporterId = $1", [sub]);
    if (result.rows.length === 0) {
      return res.status(403).json({ error: "User not authorized" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.viewProfile = (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
  };


exports.updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    try {
        const result = await pool.query('UPDATE Reporter SET role = $1 WHERE reporterId = $2 RETURNING *', [role, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

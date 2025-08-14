const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const adminMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId = decoded.id;

    const result = await pool.query('SELECT adminId FROM admins WHERE adminId = $1', [adminId]);

    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: Admin not found' });
    }

    req.user = { id: adminId }; // Attach to request if needed
    next();
  } catch (error) {
    console.error('Error in adminMiddleware:', error.message);
    res.status(500).json({ message: 'Server error while verifying admin privileges' });
  }
};

module.exports = adminMiddleware;

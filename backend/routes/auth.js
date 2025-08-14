const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const adminMiddleware = require('../middleware/adminMiddleware');

// Login route for admins
router.post('/login', userController.loginUser);

// Signup route for admins
router.post('/signup', userController.singupUser);

// Get all admins (protected route)
router.get('/users', adminMiddleware, userController.getAllAdmins);

// Get current logged-in admin profile
router.get('/current-user', adminMiddleware, userController.getCurrentAdmin);

// Get admin by ID (protected)
router.get('/users/:id', adminMiddleware, userController.getAdminById);

module.exports = router;
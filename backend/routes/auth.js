const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Sign-up Route:
router.post('/signup', userController.createUser);

// Get users
router.get('/reporters', authMiddleware, userController.getAllUsers);
router.get('/reporters/:id', authMiddleware, userController.getUserById);
// router.get('/current-user', userController.getCurrentUser);
router.get('/profile', authMiddleware, userController.getCurrentUser);
// router.get('/admin/dashboard', authMiddleware, adminMiddleware, );

// Login Route
router.post('/login', userController.findUserByEmail);


module.exports = router;
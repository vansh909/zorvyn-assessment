const express = require('express');
const router = express.Router();

//importing controllers and middlewares
const {
  addUser,
  login,
  getAllUsers,
  changeUserRole,
  changeUserStatus
} = require('../controllers/user.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');

// Auth
router.post('/signup', addUser);
router.post('/login', login);

// Users
router.get('/', authMiddleware, getAllUsers);
router.put('/:id/role', authMiddleware, changeUserRole);
router.put('/:id/status', authMiddleware, changeUserStatus);

module.exports = router;
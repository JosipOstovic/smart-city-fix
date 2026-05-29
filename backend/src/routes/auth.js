const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const authService = require('../services/authService');
const User = require('../models/user');

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /register
router.post(
  '/register',
  [
    body('first_name').notEmpty().trim().withMessage('First name is required'),
    body('last_name').notEmpty().trim().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const { user, token } = await authService.register({ first_name, last_name, email, password });

      res.cookie('token', token, COOKIE_OPTIONS);
      res.status(201).json({ user });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({
          error: { code: 'CONFLICT', message: err.message },
        });
      }
      next(err);
    }
  }
);

// POST /login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);

      res.cookie('token', token, COOKIE_OPTIONS);
      res.status(200).json({ user });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({
          error: { code: 'UNAUTHORIZED', message: err.message },
        });
      }
      next(err);
    }
  }
);

// POST /logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out' });
});

// GET /me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
    }
    res.status(200).json({ user: authService.sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

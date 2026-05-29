const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/user');

const SALT_ROUNDS = 10;

async function register({ first_name, last_name, email, password }) {
  const existing = await User.findByEmail(email);
  if (existing) {
    const error = new Error('Email already in use');
    error.status = 409;
    throw error;
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await User.create({ first_name, last_name, email, password_hash });
  const token = generateToken(user);

  return { user, token };
}

async function login(email, password) {
  const user = await User.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user: sanitizeUser(user), token };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function sanitizeUser(user) {
  const { password_hash, ...sanitized } = user;
  return sanitized;
}

module.exports = {
  register,
  login,
  generateToken,
  sanitizeUser,
};

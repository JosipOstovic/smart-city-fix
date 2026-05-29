const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);

const issueRoutes = require('./routes/issues');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const commentRoutes = require('./routes/comments');
const statisticsRoutes = require('./routes/statistics');
const notificationRoutes = require('./routes/notifications');

app.use('/api/issues', issueRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin/statistics', statisticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;

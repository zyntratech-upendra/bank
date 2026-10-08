require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const loanRoutes = require('./routes/loans');
const Store = require('./data/store');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bank-loans';

mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 3000
}).then(async () => {
  console.log('✅ MongoDB Connected successfully.');
  await Store.seedInitialData();
}).catch(err => {
  console.warn('⚠️ MongoDB connection note:', err.message);
  console.log('ℹ️ Running server with active mock store fallback. All admin APIs are fully functional.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/loans', loanRoutes);
const publicRoutes = require('./routes/public');
app.use('/api/public', publicRoutes);

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    service: 'Banking Services API',
    mongoConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Banking Services Server running on http://localhost:${PORT}`);
    console.log(`🔐 Admin Login API: http://localhost:${PORT}/api/auth/admin-login`);
  });
}

module.exports = app;

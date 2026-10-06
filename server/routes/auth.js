const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Store = require('../data/store');
const { verifyToken } = require('../middleware/auth');

// Register (Regular user)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, aadhaarNumber, panNumber, aadhaarDocUrl, panDocUrl, profilePicUrl } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await Store.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await Store.createUser({
      name,
      email,
      password,
      phone,
      aadhaarNumber,
      panNumber,
      aadhaarDocUrl,
      panDocUrl,
      profilePicUrl,
      role: 'user',
      title: 'Customer',
      branch: 'Vijayawada'
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// General Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await Store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      {
        id: user._id || user.id,
        role: user.role,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET || 'banking_secure_super_jwt_secret_key_2026_xyz',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch || 'Vijayawada',
        title: user.title || (user.role === 'admin' ? 'Branch Manager' : 'Customer'),
        avatar: user.avatar || '',
        profilePicUrl: user.profilePicUrl || '',
        aadhaarDocUrl: user.aadhaarDocUrl || '',
        panDocUrl: user.panDocUrl || ''
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin Dedicated Login
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Admin email and password are required' });
    }

    const user = await Store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Role check: must be admin or manager
    if (user.role !== 'admin' && user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied: User does not have administrator privileges' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    const token = jwt.sign(
      {
        id: user._id || user.id,
        role: user.role,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET || 'banking_secure_super_jwt_secret_key_2026_xyz',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch || 'Vijayawada',
        title: user.title || 'Branch Manager',
        avatar: user.avatar || '',
        profilePicUrl: user.profilePicUrl || '',
        aadhaarDocUrl: user.aadhaarDocUrl || '',
        panDocUrl: user.panDocUrl || ''
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify Current Token / Profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await Store.findUserById(req.user.id || req.user._id);
    if (!user) {
      return res.json({ user: req.user });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get Current User's Applications
router.get('/me/applications', verifyToken, async (req, res) => {
  try {
    const user = await Store.findUserById(req.user.id || req.user._id);
    const email = user ? user.email : req.user.email;
    
    // Get all applications and filter by user email or ID
    const allApps = await Store.getAllApplications();
    const myApps = allApps.filter(app => 
      app.email === email || 
      app.applicantEmail === email ||
      (app.user && app.user.toString() === (req.user.id || req.user._id))
    );
    
    res.json(myApps);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

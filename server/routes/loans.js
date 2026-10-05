const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Middleware to verify token would go here in a real app, skipping for simplicity

router.post('/apply', async (req, res) => {
  try {
    const { userId, loanType, amount } = req.body;
    const loan = new Loan({ user: userId, loanType, amount });
    await loan.save();
    res.status(201).json({ message: 'Loan application submitted successfully', loan });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/my-loans/:userId', async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.params.userId });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;

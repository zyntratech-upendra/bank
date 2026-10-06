const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Middleware to verify token would go here in a real app, skipping for simplicity

router.post('/apply', async (req, res) => {
  try {
    const { applicantName, applicantMobile, loanType, amount, branch } = req.body;
    
    // Generate a unique application ID
    const count = await Loan.countDocuments();
    const applicationId = `APP${new Date().getFullYear()}${String(count + 1).padStart(3, '0')}`;

    const loan = new Loan({ 
      applicationId,
      applicantName, 
      applicantMobile, 
      loanType, 
      amount: Number(amount) || 0,
      branch: branch || 'Vijayawada'
    });
    
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

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Loan = require('../models/Loan');
const Store = require('../data/store');

router.post('/apply', async (req, res) => {
  try {
    const { 
      applicantName, 
      applicantMobile, 
      applicantEmail,
      loanType, 
      amount, 
      branch,
      preferredBank,
      tenure,
      goldWeight,
      purpose,
      userId
    } = req.body;

    if (!applicantName || !applicantMobile || !loanType || !amount) {
      return res.status(400).json({ message: 'Applicant name, mobile, loan type, and requested amount are required' });
    }

    // Try to get user from token if available
    let resolvedUserId = userId || null;
    let resolvedEmail = applicantEmail || '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'banking_secure_super_jwt_secret_key_2026_xyz');
        if (decoded && (decoded.id || decoded._id)) {
          resolvedUserId = decoded.id || decoded._id;
          if (!resolvedEmail && decoded.email) resolvedEmail = decoded.email;
        }
      } catch (e) {
        // Token optional or expired
      }
    }

    const currentYear = new Date().getFullYear();
    let count = 0;
    try {
      count = await Loan.countDocuments();
    } catch (e) {
      count = Math.floor(Math.random() * 500) + 1;
    }
    const applicationId = `APP${currentYear}${String(count + 1).padStart(3, '0')}`;

    const loanData = {
      applicationId,
      user: resolvedUserId,
      applicantName: String(applicantName).trim(),
      applicantMobile: String(applicantMobile).trim(),
      applicantEmail: String(resolvedEmail).trim(),
      loanType: String(loanType).trim(),
      amount: Number(amount) || 0,
      branch: branch || 'Vijayawada',
      purpose: purpose || 'Financial requirements',
      loanTenure: Number(tenure) || 12,
      interestRate: 8.5,
      status: 'KYC Pending',
      assignedTo: 'Ravi Kumar',
      goldDetails: {
        weightGrams: Number(goldWeight) || 0,
        carat: 22,
        estimatedValue: (Number(goldWeight) || 0) * 7000,
        ornamentType: 'Gold Ornaments'
      },
      bankDetails: {
        bankName: preferredBank || 'Union Bank',
        accountNumber: 'XXXXXXXX1234',
        ifsc: 'UBIN0531234'
      },
      submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      submittedAt: new Date(),
      history: [
        {
          action: 'Application submitted online',
          by: applicantName,
          date: new Date().toLocaleString('en-GB')
        }
      ]
    };

    let savedLoan = null;
    try {
      savedLoan = await Store.createApplication(loanData);
    } catch (err) {
      console.warn('Store.createApplication error, trying direct Loan save:', err.message);
      const newLoan = new Loan(loanData);
      savedLoan = await newLoan.save();
    }

    res.status(201).json({ 
      message: 'Loan application submitted successfully and sent to admin applications', 
      application: savedLoan,
      loan: savedLoan,
      applicationId 
    });
  } catch (err) {
    console.error('Error submitting loan application:', err);
    res.status(500).json({ message: 'Server error submitting application', error: err.message });
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

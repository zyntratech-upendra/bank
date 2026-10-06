const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  loanType: { type: String, required: true, unique: true }, // 'Gold Loan', 'Loan Transfer', 'One Lending', 'Personal Loan', 'Business Loan'
  interestRate: { type: Number, default: 8.5 },
  processingFee: { type: Number, default: 1.0 },
  minAmount: { type: Number, default: 10000 },
  maxAmount: { type: Number, default: 5000000 },
  tenure: { type: String, default: '3 - 36 Months' },
  prepaymentCharges: { type: Number, default: 0.5 },
  enableLatePayment: { type: Boolean, default: true },
  enableGoldStorage: { type: Boolean, default: true },
  enableInsurance: { type: Boolean, default: true },
  enableGst: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);

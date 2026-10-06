const mongoose = require('mongoose');

const bankRateSchema = new mongoose.Schema({
  cityName: { type: String, required: true },
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  goldRatePerGram: { type: Number, required: true },
  interestRate: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('BankRate', bankRateSchema);

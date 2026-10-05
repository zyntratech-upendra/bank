const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanType: { type: String, enum: ['gold', 'one_lending', 'transfer'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  documents: [{ type: String }],
  kycCompleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);

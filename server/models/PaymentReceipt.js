const mongoose = require('mongoose');

const paymentReceiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true }, // e.g. RCP-2026-0001
  type: { 
    type: String, 
    enum: ['GIVEN', 'TAKEN'], // GIVEN = Loan Disbursement / Cash given to customer, TAKEN = EMI / Loan Repayment collected from customer
    required: true 
  },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  loanId: { type: String, default: '' }, // applicationId or Loan reference
  amount: { type: Number, required: true },
  paymentMode: { 
    type: String, 
    enum: ['Cash', 'Bank Transfer (NEFT/RTGS)', 'UPI', 'Cheque', 'Demand Draft'], 
    default: 'Bank Transfer (NEFT/RTGS)' 
  },
  transactionReference: { type: String, default: '' }, // UTR, Cheque #, or UPI Ref
  paymentDate: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) },
  notes: { type: String, default: '' },
  receivedOrIssuedBy: { type: String, default: 'Ravi Kumar (Admin)' },
  branch: { type: String, default: 'Vijayawada' }
}, { timestamps: true });

module.exports = mongoose.model('PaymentReceipt', paymentReceiptSchema);

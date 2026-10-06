const mongoose = require('mongoose');

const documentItemSchema = new mongoose.Schema({
  id: { type: String },
  type: { type: String, required: true }, // 'Aadhaar Card', 'PAN Card', 'Address Proof', 'Gold Invoice / Ornament Photo'
  fileName: { type: String },
  fileUrl: { type: String },
  status: { type: String, enum: ['Verified', 'Pending', 'Rejected'], default: 'Pending' },
  remarks: { type: String, default: '-' },
  uploadedOn: { type: String, default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
}, { _id: false });

const loanSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicantName: { type: String, required: true },
  applicantMobile: { type: String, required: true },
  applicantEmail: { type: String, default: '' },
  dateOfBirth: { type: String, default: '15 Jan 1990' },
  address: { type: String, default: '12-3-45, MG Road, Vijayawada, AP' },
  loanType: { 
    type: String, 
    enum: ['Gold Loan', 'Loan Transfer', 'One Lending', 'Personal Loan', 'Business Loan'], 
    required: true 
  },
  amount: { type: Number, required: true },
  interestRate: { type: Number, default: 8.5 },
  loanTenure: { type: Number, default: 12 }, // in months
  purpose: { type: String, default: 'Personal' },
  submittedOn: { 
    type: String, 
    default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
  },
  submittedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['KYC Pending', 'Under Review', 'Document Pending', 'Approved', 'Rejected', 'Disbursed'], 
    default: 'KYC Pending' 
  },
  assignedTo: { type: String, default: 'Ravi Kumar' },
  branch: { type: String, default: 'Vijayawada' },
  goldDetails: {
    weightGrams: { type: Number, default: 0 },
    carat: { type: Number, default: 22 },
    estimatedValue: { type: Number, default: 0 },
    ornamentType: { type: String, default: 'Gold Ornaments / Bangles' }
  },
  bankDetails: {
    accountNumber: { type: String, default: 'XXXXXXXX1234' },
    bankName: { type: String, default: 'State Bank of India' },
    ifsc: { type: String, default: 'SBIN0001234' }
  },
  documents: [documentItemSchema],
  kycCompleted: { type: Boolean, default: false },
  disbursementDetails: {
    disbursedAmount: { type: Number, default: 0 },
    disbursementDate: { type: String, default: '' },
    repaymentMode: { type: String, default: 'Monthly EMI' },
    firstEmiDate: { type: String, default: '' },
    monthlyEmi: { type: Number, default: 0 },
    bankAccount: { type: String, default: '' },
    remarks: { type: String, default: '' },
    isDisbursed: { type: Boolean, default: false }
  },
  comments: [{
    author: { type: String },
    role: { type: String },
    text: { type: String },
    date: { type: String, default: () => new Date().toISOString() }
  }],
  history: [{
    action: { type: String },
    by: { type: String },
    date: { type: String, default: () => new Date().toLocaleString() }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);

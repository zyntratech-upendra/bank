const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceName: { type: String, required: true },
  
  // Customer info at time of request
  customerName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  
  // Dynamic form data (e.g. Bank Details, Gold Weight, etc.)
  formData: { type: mongoose.Schema.Types.Mixed },
  
  // Admin workflow
  status: { type: String, enum: ['Pending', 'Under Review', 'Verified', 'Rejected', 'Completed'], default: 'Pending' },
  adminRemarks: { type: String, default: '' },
  assignedTo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);

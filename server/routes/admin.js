const express = require('express');
const router = express.Router();
const Store = require('../data/store');
const { verifyAdmin } = require('../middleware/auth');

// All admin routes require valid admin role
router.use(verifyAdmin);

// Dashboard overview stats
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await Store.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: 'Error loading dashboard stats', error: err.message });
  }
});

// List applications with filters (status, loanType, branch, search)
router.get('/applications', async (req, res) => {
  try {
    const { status, loanType, branch, search } = req.query;
    const applications = await Store.getAllApplications({ status, loanType, branch, search });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving applications', error: err.message });
  }
});

// Get single application detail
router.get('/applications/:id', async (req, res) => {
  try {
    const application = await Store.getApplicationById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving application', error: err.message });
  }
});

// Update application status (Approve, Reject, Under Review, etc.)
router.patch('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const adminName = req.user?.name || 'Ravi Kumar';
    const updated = await Store.updateApplicationStatus(req.params.id, status, adminName);
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: `Status updated to ${status}`, application: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating application status', error: err.message });
  }
});

// Assign application to staff
router.patch('/applications/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    if (!assignedTo) {
      return res.status(400).json({ message: 'Assigned staff is required' });
    }
    const adminName = req.user?.name || 'Ravi Kumar';
    const updated = await Store.assignApplication(req.params.id, assignedTo, adminName);
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: `Assigned to ${assignedTo}`, application: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning application', error: err.message });
  }
});

// Update document verification status
router.patch('/applications/:id/documents/:docId', async (req, res) => {
  try {
    const { status, remarks } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Document status is required' });
    }
    const adminName = req.user?.name || 'Ravi Kumar';
    const updated = await Store.updateDocumentStatus(req.params.id, req.params.docId, status, remarks, adminName);
    if (!updated) {
      return res.status(404).json({ message: 'Application or document not found' });
    }
    res.json({ message: 'Document status updated', application: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating document status', error: err.message });
  }
});

// Disburse loan
router.post('/applications/:id/disburse', async (req, res) => {
  try {
    const disbursementData = req.body;
    const adminName = req.user?.name || 'Ravi Kumar';
    const updated = await Store.disburseLoan(req.params.id, disbursementData, adminName);
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Loan disbursed successfully', application: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error processing disbursement', error: err.message });
  }
});

// KYC Verification list
router.get('/kyc', async (req, res) => {
  try {
    const apps = await Store.getAllApplications();
    const kycList = [];
    apps.forEach(app => {
      if (app.documents && app.documents.length > 0) {
        app.documents.forEach(doc => {
          kycList.push({
            appId: app.applicationId,
            customerId: `CUST${app.applicationId.replace(/\D/g, '').slice(-4) || '1023'}`,
            name: app.applicantName,
            mobile: app.applicantMobile,
            docId: doc.id || doc.type,
            documentType: doc.type,
            fileName: doc.fileName,
            status: doc.status,
            remarks: doc.remarks,
            uploadedOn: doc.uploadedOn || app.submittedOn
          });
        });
      }
    });
    res.json(kycList);
  } catch (err) {
    res.status(500).json({ message: 'Error loading KYC items', error: err.message });
  }
});

// Gold Loans specific list
router.get('/gold-loans', async (req, res) => {
  try {
    const apps = await Store.getAllApplications({ loanType: 'Gold Loan' });
    const formatted = apps.map((app, index) => ({
      loanNo: `GL00${123 + index}`,
      applicationId: app.applicationId,
      customerName: app.applicantName,
      goldWeight: `${app.goldDetails?.weightGrams || 50} gms`,
      loanAmount: app.amount,
      interestRate: `${app.interestRate || 8.5}%`,
      status: app.status,
      branch: app.branch
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error loading gold loans', error: err.message });
  }
});

// Users & Roles
router.get('/users', async (req, res) => {
  try {
    const users = await Store.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error loading users', error: err.message });
  }
});

router.get('/customers', async (req, res) => {
  try {
    const customers = await Store.getAllCustomers();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error loading customers', error: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { name, email, role, branch, title, phone, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    const newUser = await Store.createUser({
      name,
      email,
      role: role || 'officer',
      branch: branch || 'Vijayawada',
      title: title || 'Staff Member',
      phone: phone || '+91 98480 00000',
      password: password || 'Staff@123',
      status: 'Active'
    });
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const updated = await Store.updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully', user: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

// Settings (Interest Rates & Charges)
router.get('/settings', async (req, res) => {
  try {
    const settings = await Store.getSettings();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Error loading settings', error: err.message });
  }
});

router.put('/settings/:loanType', async (req, res) => {
  try {
    const updated = await Store.updateSetting(decodeURIComponent(req.params.loanType), req.body);
    res.json({ message: 'Settings saved successfully', setting: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating settings', error: err.message });
  }
});

// Service Locations
router.get('/locations', async (req, res) => {
  try {
    const locations = await Store.getLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: 'Error loading locations', error: err.message });
  }
});

router.post('/locations', async (req, res) => {
  try {
    const newLoc = await Store.addLocation(req.body);
    res.status(201).json({ message: 'Location added successfully', location: newLoc });
  } catch (err) {
    res.status(500).json({ message: 'Error creating location', error: err.message });
  }
});

router.put('/locations/:id', async (req, res) => {
  try {
    const updated = await Store.updateLocation(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location updated successfully', location: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating location', error: err.message });
  }
});

router.delete('/locations/:id', async (req, res) => {
  try {
    const deleted = await Store.deleteLocation(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting location', error: err.message });
  }
});

// Bank Gold Loan Rates
router.get('/bank-rates', async (req, res) => {
  try {
    const rates = await Store.getAllBankRates();
    res.json(rates);
  } catch (err) {
    res.status(500).json({ message: 'Error loading bank rates', error: err.message });
  }
});

router.post('/bank-rates', async (req, res) => {
  try {
    const newRate = await Store.addBankRate(req.body);
    if (!newRate) return res.status(400).json({ message: 'Failed to create (DB only)' });
    res.status(201).json({ message: 'Bank rate added successfully', rate: newRate });
  } catch (err) {
    res.status(500).json({ message: 'Error creating bank rate', error: err.message });
  }
});

router.put('/bank-rates/:id', async (req, res) => {
  try {
    const updated = await Store.updateBankRate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Bank rate not found' });
    }
    res.json({ message: 'Bank rate updated successfully', rate: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating bank rate', error: err.message });
  }
});

router.delete('/bank-rates/:id', async (req, res) => {
  try {
    const deleted = await Store.deleteBankRate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Bank rate not found' });
    }
    res.json({ message: 'Bank rate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting bank rate', error: err.message });
  }
});

// Services Management
router.get('/services', async (req, res) => {
  try {
    const services = await Store.getAllServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error loading services', error: err.message });
  }
});

router.post('/services', async (req, res) => {
  try {
    const service = await Store.addService(req.body);
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error adding service', error: err.message });
  }
});

router.put('/services/:id', async (req, res) => {
  try {
    const service = await Store.updateService(req.params.id, req.body);
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: 'Error updating service', error: err.message });
  }
});

router.delete('/services/:id', async (req, res) => {
  try {
    await Store.deleteService(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting service', error: err.message });
  }
});

// Service Requests Management
router.get('/service-requests', async (req, res) => {
  try {
    const requests = await Store.getAllServiceRequests();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Error loading service requests', error: err.message });
  }
});

router.patch('/service-requests/:id/status', async (req, res) => {
  try {
    const { status, remarks, extraData } = req.body;
    const request = await Store.updateServiceRequestStatus(req.params.id, status, remarks, extraData);
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: 'Error updating request', error: err.message });
  }
});

// Customers
router.get('/customers', async (req, res) => {
  try {
    const User = require('../models/User');
    const customers = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching customers', error: err.message });
  }
});

// Payments & Receipts (Amount Given and Taken records)
const PaymentReceipt = require('../models/PaymentReceipt');

router.get('/payments', async (req, res) => {
  try {
    const receipts = await PaymentReceipt.find().sort({ createdAt: -1 });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments', error: err.message });
  }
});

router.post('/payments', async (req, res) => {
  try {
    const {
      type,
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      loanId,
      amount,
      paymentMode,
      transactionReference,
      paymentDate,
      notes,
      branch
    } = req.body;

    if (!type || !customerName || !amount) {
      return res.status(400).json({ message: 'Type, Customer Name and Amount are required.' });
    }

    const receiptCount = await PaymentReceipt.countDocuments();
    const receiptNumber = `RCP-${new Date().getFullYear()}-${String(receiptCount + 1).padStart(4, '0')}`;

    const newReceipt = new PaymentReceipt({
      receiptNumber,
      type, // 'GIVEN' or 'TAKEN'
      customerId: customerId || undefined,
      customerName,
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      loanId: loanId || '',
      amount: Number(amount),
      paymentMode: paymentMode || 'Bank Transfer (NEFT/RTGS)',
      transactionReference: transactionReference || '',
      paymentDate: paymentDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: notes || '',
      receivedOrIssuedBy: req.admin?.name || 'Ravi Kumar (Admin)',
      branch: branch || 'Vijayawada'
    });

    await newReceipt.save();
    res.status(201).json({ message: 'Payment record created successfully', receipt: newReceipt });
  } catch (err) {
    res.status(500).json({ message: 'Error creating payment record', error: err.message });
  }
});

router.delete('/payments/:id', async (req, res) => {
  try {
    await PaymentReceipt.findByIdAndDelete(req.params.id);
    res.json({ message: 'Payment receipt deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting payment record', error: err.message });
  }
});

module.exports = router;

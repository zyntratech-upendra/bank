const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Loan = require('../models/Loan');
const Setting = require('../models/Setting');
const Location = require('../models/Location');
const BankRate = require('../models/BankRate');
const Service = require('../models/Service');
const ServiceRequest = require('../models/ServiceRequest');
const { initialUsers, initialApplications, initialSettings, initialLocations } = require('./mockData');

const DEFAULT_ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123', 10);
const DEFAULT_USER_PASSWORD_HASH = bcrypt.hashSync('User@123', 10);

// In-memory containers seeded with realistic mock data
const applicantUsers = initialApplications.map((app, idx) => ({
  _id: `mem_usr_app_${idx + 1}`,
  id: `USR10${idx + 1}`,
  name: app.applicantName,
  email: app.applicantEmail,
  phone: app.applicantMobile,
  role: 'user',
  title: 'Customer',
  branch: app.branch || 'Vijayawada',
  status: 'Active',
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.applicantName)}&background=0e274a&color=fff&size=128`,
  password: DEFAULT_USER_PASSWORD_HASH
}));

let memUsers = [
  ...initialUsers.map(u => ({
    ...u,
    password: (u.role === 'admin' || u.role === 'manager') ? DEFAULT_ADMIN_PASSWORD_HASH : DEFAULT_USER_PASSWORD_HASH
  })),
  ...applicantUsers
];
let memApplications = [...initialApplications];
let memSettings = [...initialSettings];
let memLocations = [...initialLocations];
let memBankRates = [
  { bankName: 'Union Bank of India', branchName: 'Bunder Road Branch', cityName: 'Vijayawada', goldRatePerGram: 6450, interestRate: 8.4 },
  { bankName: 'Canara Bank', branchName: 'Governorpet Branch', cityName: 'Vijayawada', goldRatePerGram: 6420, interestRate: 8.5 },
  { bankName: 'State Bank of India', branchName: 'MG Road Main Branch', cityName: 'Vijayawada', goldRatePerGram: 6400, interestRate: 8.65 },
  { bankName: 'HDFC Bank', branchName: 'Banjara Hills', cityName: 'Hyderabad', goldRatePerGram: 6480, interestRate: 8.8 }
];
let memServices = [
  { title: 'Gold Loan', description: 'Lowest interest rates backed by govt & partner banks. Up to 75% LTV.', status: 'Active' },
  { title: 'Loan Transfer', description: 'Switch high interest loans to government banks seamlessly with zero penalty.', status: 'Active' },
  { title: 'One Lending', description: 'Single window unified loan eligibility across multiple partner banks.', status: 'Active' },
  { title: 'Business Loan', description: 'Collateral-free and MSME loan solutions for enterprises.', status: 'Active' }
];
let memServiceRequests = [];

function isDbConnected() {
  return mongoose.connection && mongoose.connection.readyState === 1;
}

const Store = {
  // Check admin exists and seed if empty
  async seedInitialData() {
    try {
      if (!isDbConnected()) {
        console.log('[Store] Operating in In-Memory fallback mode (MongoDB not connected).');
        return;
      }

      console.log('[Store] MongoDB is connected. Ensuring default admin & collections are seeded...');

      // Seed Admin
      const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@bankingservices.com';
      const adminExists = await User.findOne({ email: adminEmail });
      if (!adminExists) {
        const adminUser = new User({
          name: 'Ravi Kumar',
          email: adminEmail,
          password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123',
          phone: '+91 98480 12345',
          role: 'admin',
          branch: 'Vijayawada',
          title: 'Branch Manager',
          status: 'Active',
          avatar: initialUsers[0].avatar
        });
        await adminUser.save();
        console.log(`[Store] Seeded default Admin user: ${adminEmail}`);
      }

      // Seed demo users if DB is mostly empty
      const userCount = await User.countDocuments();
      if (userCount <= 1) {
        for (const u of initialUsers) {
          if (u.email === adminEmail) continue;
          const exists = await User.findOne({ email: u.email });
          if (!exists) {
            await new User({ ...u, password: 'User@123' }).save();
          }
        }
        for (const app of initialApplications) {
          const exists = await User.findOne({ email: app.applicantEmail });
          if (!exists) {
            await new User({
              name: app.applicantName,
              email: app.applicantEmail,
              phone: app.applicantMobile,
              role: 'user',
              title: 'Customer',
              branch: app.branch || 'Vijayawada',
              status: 'Active',
              password: 'User@123'
            }).save();
          }
        }
        console.log('[Store] Seeded mock users into MongoDB');
      }

      // Seed demo loans if DB is empty
      const loanCount = await Loan.countDocuments();
      if (loanCount === 0) {
        for (const app of initialApplications) {
          await new Loan(app).save();
        }
        console.log('[Store] Seeded mock applications into MongoDB');
      }

    } catch (err) {
      console.error('[Store] Seed error:', err.message);
    }
  },

  // Users
  async findUserByEmail(email) {
    if (isDbConnected()) {
      return await User.findOne({ email });
    }
    const normalized = email.toLowerCase().trim();
    return memUsers.find(u => u.email.toLowerCase() === normalized) || null;
  },

  async findUserById(id) {
    if (isDbConnected()) {
      return await User.findById(id).select('-password');
    }
    const u = memUsers.find(u => u._id === id || u.id === id);
    if (!u) return null;
    const { password, ...safe } = u;
    return safe;
  },

  async getAllUsers() {
    if (isDbConnected()) {
      return await User.find({ role: { $ne: 'user' } }).select('-password').sort({ createdAt: -1 });
    }
    return memUsers.filter(u => u.role !== 'user').map(({ password, ...rest }) => rest);
  },

  async getAllCustomers() {
    if (isDbConnected()) {
      return await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    }
    return memUsers.filter(u => u.role === 'user').map(({ password, ...rest }) => rest);
  },

  async createUser(userData) {
    if (isDbConnected()) {
      const user = new User(userData);
      await user.save();
      const safe = user.toObject();
      delete safe.password;
      return safe;
    }
    const hashedPassword = await bcrypt.hash(userData.password || 'User@123', 10);
    const newUser = {
      _id: `mem_usr_${Date.now()}`,
      id: `USR00${memUsers.length + 1}`,
      ...userData,
      password: hashedPassword,
      status: userData.status || 'Active',
      createdAt: new Date().toISOString()
    };
    memUsers.push(newUser);
    const { password, ...safe } = newUser;
    return safe;
  },

  async updateUser(id, updateData) {
    if (isDbConnected()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    const idx = memUsers.findIndex(u => u._id === id || u.id === id);
    if (idx === -1) return null;
    memUsers[idx] = { ...memUsers[idx], ...updateData };
    const { password, ...safe } = memUsers[idx];
    return safe;
  },

  // Applications
  async getDashboardStats() {
    let applications = [];
    let serviceRequests = [];
    if (isDbConnected()) {
      applications = await Loan.find().lean();
      serviceRequests = await ServiceRequest.find().lean();
    } else {
      applications = memApplications;
    }

    const unifiedList = [
      ...applications,
      ...serviceRequests.map(sr => ({
        ...sr,
        loanType: sr.serviceName,
        amount: sr.extraData?.['Issued Amount'] || sr.extraData?.['Disbursed Amount'] || 0,
        isServiceRequest: true,
        isApproved: sr.status === 'Completed' || sr.status === 'Cleared',
        isCleared: sr.status === 'Cleared',
        isRejected: sr.status === 'Rejected',
        isPending: ['Pending', 'Under Review', 'Verified'].includes(sr.status)
      }))
    ];

    unifiedList.forEach(a => {
      if (!a.isServiceRequest) {
        a.isApproved = a.status === 'Approved' || a.status === 'Disbursed';
        a.isRejected = a.status === 'Rejected';
        a.isPending = ['KYC Pending', 'Document Pending', 'Pending'].includes(a.status);
      }
    });

    const totalApplications = unifiedList.length;
    const pendingVerification = unifiedList.filter(a => a.isPending).length;
    
    // Original code checked all approved loans for "approvedToday", preserving logic
    const allApproved = unifiedList.filter(a => a.isApproved).length;

    // Calculate total disbursed amount
    const totalDisbursedValue = unifiedList
      .filter(a => a.isApproved && a.amount)
      .reduce((sum, app) => {
        const val = Number(app.amount.toString().replace(/,/g, '')) || 0;
        return sum + val;
      }, 0);
    const disbursedAmount = `₹${(totalDisbursedValue / 100000).toFixed(2)} Lakh`;
    const activeLoans = unifiedList.filter(a => a.isApproved && !a.isCleared).length;

    const distMap = {};
    unifiedList.forEach(a => {
      if (a.loanType) {
        distMap[a.loanType] = (distMap[a.loanType] || 0) + 1;
      }
    });

    const colors = ['#e2a033', '#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#8b5cf6'];
    const loanTypeDistribution = Object.keys(distMap).map((key, idx) => ({
      name: key,
      count: distMap[key],
      percentage: totalApplications ? Math.round((distMap[key] / totalApplications) * 100) : 0,
      color: colors[idx % colors.length]
    }));

    // Group last 7 days of applications
    const weeklyMap = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      weeklyMap[dateStr] = { date: dateStr, received: 0, approved: 0, rejected: 0 };
    }

    unifiedList.forEach(app => {
      const appDate = new Date(app.createdAt || Date.now());
      const dateStr = appDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      if (weeklyMap[dateStr]) {
        weeklyMap[dateStr].received++;
        if (app.isApproved) weeklyMap[dateStr].approved++;
        if (app.isRejected) weeklyMap[dateStr].rejected++;
      }
    });

    const weeklyTrend = Object.values(weeklyMap);

    return {
      metrics: {
        totalApplications,
        pendingVerification,
        approvedToday: allApproved,
        disbursedAmount,
        activeLoans
      },
      weeklyTrend,
      loanTypeDistribution,
      recentApplications: unifiedList.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now())).slice(0, 10)
    };
  },

  async getAllApplications(filters = {}) {
    let list = [];
    if (isDbConnected()) {
      const query = {};
      if (filters.status && filters.status !== 'all') query.status = filters.status;
      if (filters.loanType && filters.loanType !== 'all') query.loanType = filters.loanType;
      if (filters.branch && filters.branch !== 'all') query.branch = filters.branch;
      if (filters.search) {
        query.$or = [
          { applicationId: { $regex: filters.search, $options: 'i' } },
          { applicantName: { $regex: filters.search, $options: 'i' } },
          { applicantMobile: { $regex: filters.search, $options: 'i' } }
        ];
      }
      list = await Loan.find(query).sort({ createdAt: -1 }).lean();
    } else {
      list = memApplications.filter(app => {
        if (filters.status && filters.status !== 'all' && app.status !== filters.status) return false;
        if (filters.loanType && filters.loanType !== 'all' && app.loanType !== filters.loanType) return false;
        if (filters.branch && filters.branch !== 'all' && app.branch !== filters.branch) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const match = (app.applicationId && app.applicationId.toLowerCase().includes(q)) ||
                        (app.applicantName && app.applicantName.toLowerCase().includes(q)) ||
                        (app.applicantMobile && app.applicantMobile.includes(q));
          if (!match) return false;
        }
        return true;
      });
    }
    return list;
  },

  async createApplication(data) {
    if (isDbConnected()) {
      const count = await Loan.countDocuments();
      const currentYear = new Date().getFullYear();
      const applicationId = data.applicationId || `APP${currentYear}${String(count + 1).padStart(3, '0')}`;
      const newLoan = new Loan({
        ...data,
        applicationId
      });
      await newLoan.save();
      return newLoan.toObject ? newLoan.toObject() : newLoan;
    }
    const currentYear = new Date().getFullYear();
    const applicationId = data.applicationId || `APP${currentYear}${String(memApplications.length + 1).padStart(3, '0')}`;
    const newApp = {
      _id: 'app_' + Date.now(),
      applicationId,
      status: 'KYC Pending',
      submittedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      submittedAt: new Date(),
      history: [{ action: 'Application submitted', by: data.applicantName || 'Applicant', date: new Date().toLocaleString('en-GB') }],
      ...data
    };
    memApplications.unshift(newApp);
    return newApp;
  },

  async getApplicationById(id) {
    if (isDbConnected()) {
      return await Loan.findOne({
        $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { applicationId: id }]
      }).lean();
    }
    return memApplications.find(a => a._id === id || a.applicationId === id) || null;
  },

  async updateApplicationStatus(id, status, adminName = 'Ravi Kumar') {
    const historyEntry = {
      action: `Status updated to ${status}`,
      by: adminName,
      date: new Date().toLocaleString('en-GB')
    };

    if (isDbConnected()) {
      return await Loan.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { applicationId: id }] },
        { 
          $set: { status },
          $push: { history: historyEntry }
        },
        { new: true }
      );
    }

    const app = memApplications.find(a => a._id === id || a.applicationId === id);
    if (!app) return null;
    app.status = status;
    app.history.unshift(historyEntry);
    return app;
  },

  async assignApplication(id, assignedTo, adminName = 'Ravi Kumar') {
    const historyEntry = {
      action: `Assigned to ${assignedTo}`,
      by: adminName,
      date: new Date().toLocaleString('en-GB')
    };

    if (isDbConnected()) {
      return await Loan.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(id) ? id : null }, { applicationId: id }] },
        { 
          $set: { assignedTo },
          $push: { history: historyEntry }
        },
        { new: true }
      );
    }

    const app = memApplications.find(a => a._id === id || a.applicationId === id);
    if (!app) return null;
    app.assignedTo = assignedTo;
    app.history.unshift(historyEntry);
    return app;
  },

  async updateDocumentStatus(appId, docId, status, remarks, adminName = 'Ravi Kumar') {
    if (isDbConnected()) {
      const app = await Loan.findOne({
        $or: [{ _id: mongoose.isValidObjectId(appId) ? appId : null }, { applicationId: appId }]
      });
      if (!app) return null;
      const doc = app.documents.find(d => d.id === docId || d.type === docId);
      if (doc) {
        doc.status = status;
        if (remarks) doc.remarks = remarks;
      }
      app.history.push({
        action: `Document ${doc ? doc.type : docId} marked as ${status}`,
        by: adminName,
        date: new Date().toLocaleString('en-GB')
      });
      await app.save();
      return app;
    }

    const app = memApplications.find(a => a._id === appId || a.applicationId === appId);
    if (!app) return null;
    const doc = app.documents.find(d => d.id === docId || d.type === docId);
    if (doc) {
      doc.status = status;
      if (remarks) doc.remarks = remarks;
    }
    app.history.unshift({
      action: `Document ${doc ? doc.type : docId} marked as ${status}`,
      by: adminName,
      date: new Date().toLocaleString('en-GB')
    });
    return app;
  },

  async disburseLoan(appId, disbursementData, adminName = 'Ravi Kumar') {
    const update = {
      status: 'Disbursed',
      disbursementDetails: {
        ...disbursementData,
        isDisbursed: true,
        disbursedBy: adminName
      }
    };
    if (disbursementData.interestRate) update.interestRate = disbursementData.interestRate;
    if (disbursementData.tenure) update.loanTenure = disbursementData.tenure;
    if (disbursementData.amount) update.amount = disbursementData.amount;
    const historyEntry = {
      action: `Loan disbursed ₹${Number(disbursementData.amount || 0).toLocaleString('en-IN')}`,
      by: adminName,
      date: new Date().toLocaleString('en-GB')
    };

    if (isDbConnected()) {
      return await Loan.findOneAndUpdate(
        { $or: [{ _id: mongoose.isValidObjectId(appId) ? appId : null }, { applicationId: appId }] },
        { 
          $set: update,
          $push: { history: historyEntry }
        },
        { new: true }
      );
    }

    const app = memApplications.find(a => a._id === appId || a.applicationId === appId);
    if (!app) return null;
    app.status = 'Disbursed';
    app.disbursementDetails = { ...app.disbursementDetails, ...disbursementData, isDisbursed: true, disbursedBy: adminName };
    app.history.unshift(historyEntry);
    return app;
  },

  // Settings
  async getSettings() {
    if (isDbConnected()) {
      return await Setting.find().lean();
    }
    return memSettings;
  },

  async updateSetting(loanType, settingData) {
    if (isDbConnected()) {
      return await Setting.findOneAndUpdate(
        { loanType },
        { $set: settingData },
        { new: true, upsert: true }
      );
    }
    const idx = memSettings.findIndex(s => s.loanType === loanType);
    if (idx !== -1) {
      memSettings[idx] = { ...memSettings[idx], ...settingData };
      return memSettings[idx];
    } else {
      const newS = { loanType, ...settingData };
      memSettings.push(newS);
      return newS;
    }
  },

  // Locations
  // Locations
  async getLocations() {
    if (isDbConnected()) {
      return await mongoose.model('Location').find().sort({ createdAt: 1 });
    }
    return memLocations;
  },

  async addLocation(locData) {
    if (isDbConnected()) {
      const count = await mongoose.model('Location').countDocuments();
      const newLoc = new (mongoose.model('Location'))({
        id: `LOC00${count + 1}`,
        ...locData
      });
      await newLoc.save();
      return newLoc;
    }
    const newLoc = { id: `LOC00${memLocations.length + 1}`, ...locData };
    memLocations.push(newLoc);
    return newLoc;
  },

  async updateLocation(id, locData) {
    if (isDbConnected()) {
      // First try by Mongoose _id
      if (mongoose.Types.ObjectId.isValid(id)) {
        const updated = await mongoose.model('Location').findByIdAndUpdate(id, locData, { new: true });
        if (updated) return updated;
      }
      // Fallback to custom 'id'
      return await mongoose.model('Location').findOneAndUpdate({ id }, locData, { new: true });
    }
    const idx = memLocations.findIndex(l => l.id === id);
    if (idx !== -1) {
      memLocations[idx] = { ...memLocations[idx], ...locData };
      return memLocations[idx];
    }
    return null;
  },

  async deleteLocation(id) {
    if (isDbConnected()) {
      // First try by Mongoose _id
      if (mongoose.Types.ObjectId.isValid(id)) {
        const deleted = await mongoose.model('Location').findByIdAndDelete(id);
        if (deleted) return deleted;
      }
      // Fallback to custom 'id'
      return await mongoose.model('Location').findOneAndDelete({ id });
    }
    const idx = memLocations.findIndex(l => l.id === id);
    if (idx !== -1) {
      return memLocations.splice(idx, 1)[0];
    }
    return null;
  },

  // Bank Rates
  async getAllBankRates() {
    if (isDbConnected()) {
      return await mongoose.model('BankRate').find().sort({ createdAt: -1 });
    }
    return memBankRates;
  },

  async addBankRate(rateData) {
    if (isDbConnected()) {
      const newRate = new (mongoose.model('BankRate'))(rateData);
      await newRate.save();
      return newRate;
    }
    const newRate = { _id: 'br_' + Date.now(), ...rateData };
    memBankRates.unshift(newRate);
    return newRate;
  },

  async updateBankRate(id, rateData) {
    if (isDbConnected()) {
      return await mongoose.model('BankRate').findByIdAndUpdate(id, rateData, { new: true });
    }
    const idx = memBankRates.findIndex(r => r._id === id || r.id === id);
    if (idx !== -1) {
      memBankRates[idx] = { ...memBankRates[idx], ...rateData };
      return memBankRates[idx];
    }
    return null;
  },

  async deleteBankRate(id) {
    if (isDbConnected()) {
      return await mongoose.model('BankRate').findByIdAndDelete(id);
    }
    const idx = memBankRates.findIndex(r => r._id === id || r.id === id);
    if (idx !== -1) {
      return memBankRates.splice(idx, 1)[0];
    }
    return null;
  },
  // Services
  async getAllServices() {
    if (isDbConnected()) {
      return await Service.find().sort({ createdAt: -1 });
    }
    return memServices;
  },

  async addService(serviceData) {
    if (isDbConnected()) {
      const newService = new Service(serviceData);
      await newService.save();
      return newService;
    }
    const newService = { _id: 'srv_' + Date.now(), ...serviceData };
    memServices.unshift(newService);
    return newService;
  },

  async updateService(id, serviceData) {
    if (isDbConnected()) {
      return await Service.findByIdAndUpdate(id, serviceData, { new: true });
    }
    const idx = memServices.findIndex(s => s._id === id || s.id === id);
    if (idx !== -1) {
      memServices[idx] = { ...memServices[idx], ...serviceData };
      return memServices[idx];
    }
    return null;
  },

  async deleteService(id) {
    if (isDbConnected()) {
      return await Service.findByIdAndDelete(id);
    }
    const idx = memServices.findIndex(s => s._id === id || s.id === id);
    if (idx !== -1) {
      return memServices.splice(idx, 1)[0];
    }
    return null;
  },

  // Service Requests
  async getAllServiceRequests() {
    if (isDbConnected()) {
      return await ServiceRequest.find().sort({ createdAt: -1 });
    }
    return memServiceRequests;
  },

  async createServiceRequest(requestData) {
    if (isDbConnected()) {
      const newReq = new ServiceRequest(requestData);
      await newReq.save();
      return newReq;
    }
    const newReq = {
      _id: 'sr_' + Date.now(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      ...requestData
    };
    memServiceRequests.unshift(newReq);
    return newReq;
  },

  async updateServiceRequestStatus(id, status, remarks, extraData) {
    if (isDbConnected()) {
      let update = { status, adminRemarks: remarks };
      if (extraData) {
        const doc = await ServiceRequest.findById(id);
        if (doc) {
          update.formData = { ...(doc.formData || {}), ...extraData };
        }
      }
      return await ServiceRequest.findByIdAndUpdate(id, update, { new: true });
    }
    return null;
  }
};

module.exports = Store;

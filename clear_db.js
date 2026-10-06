const mongoose = require('mongoose');
const User = require('./server/models/User');
const Loan = require('./server/models/Loan');
const Setting = require('./server/models/Setting');
const Location = require('./server/models/Location');
const BankRate = require('./server/models/BankRate');

require('dotenv').config({ path: './server/.env' });

async function clearDemoData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bank_db');
    console.log('Connected to DB');

    // Delete all loans
    await Loan.deleteMany({});
    console.log('Cleared Loans');

    // Delete all settings
    await Setting.deleteMany({});
    console.log('Cleared Settings');

    // Delete all locations
    await Location.deleteMany({});
    console.log('Cleared Locations');

    // Delete all bank rates
    await BankRate.deleteMany({});
    console.log('Cleared BankRates');

    // Delete all non-admin users and non-customer users?
    // Let's just delete all staff users, keeping role 'admin' and 'user'
    await User.deleteMany({ role: { $nin: ['admin', 'user'] } });
    console.log('Cleared Demo Staff Users');

    console.log('Demo data completely removed.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

clearDemoData();

const mongoose = require('mongoose');
const User = require('./models/User');
const Loan = require('./models/Loan');
const Setting = require('./models/Setting');
const Location = require('./models/Location');
const BankRate = require('./models/BankRate');

require('dotenv').config({ path: './.env' });

async function clearDemoData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bank_db');
    console.log('Connected to DB');

    await Loan.deleteMany({});
    console.log('Cleared Loans');

    await Setting.deleteMany({});
    console.log('Cleared Settings');

    await Location.deleteMany({});
    console.log('Cleared Locations');

    await BankRate.deleteMany({});
    console.log('Cleared BankRates');

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

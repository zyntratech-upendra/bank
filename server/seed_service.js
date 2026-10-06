const mongoose = require('mongoose');
const Service = require('./models/Service');
require('dotenv').config({ path: './.env' });

async function seedService() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bank_db');
    console.log('Connected to DB');

    // Add service
    const newService = new Service({
      title: 'Financial Help to Renew Gold Loan',
      description: 'Money lending service to clear your outstanding gold loan. Upload your loan receipt, bank details, and gold weight to get immediate financial assistance to release your pledged gold.',
      icon: 'Coins', // some icon
      status: 'Active'
    });
    
    await newService.save();
    console.log('Added Service: Financial Help to Renew Gold Loan');
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedService();

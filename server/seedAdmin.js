require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Loan = require('./models/Loan');
const Setting = require('./models/Setting');
const { initialUsers, initialApplications, initialSettings } = require('./data/mockData');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bank-loans';

async function seedAdmin() {
  console.log('==================================================');
  console.log('🏦 BANKING SERVICES - Admin Seeder & Initializer');
  console.log('==================================================');
  console.log(`Connecting to MongoDB at: ${MONGO_URI}...`);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully!\n');

    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@bankingservices.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123';

    // 1. Check or Create Admin
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log(`ℹ️ Admin user already exists: ${adminEmail}`);
      admin.role = 'admin';
      admin.title = 'Branch Manager';
      admin.branch = 'Vijayawada';
      admin.password = adminPassword; // Triggers pre-save hash
      await admin.save();
      console.log('✅ Admin credentials updated and role confirmed.');
    } else {
      admin = new User({
        name: 'Ravi Kumar',
        email: adminEmail,
        password: adminPassword,
        phone: '+91 98480 12345',
        role: 'admin',
        title: 'Branch Manager',
        branch: 'Vijayawada',
        status: 'Active',
        avatar: initialUsers[0].avatar
      });
      await admin.save();
      console.log(`✅ Admin user created successfully: ${adminEmail}`);
    }

    // 2. Seed other staff users
    console.log('\nSeeding staff members...');
    for (let i = 1; i < initialUsers.length; i++) {
      const u = initialUsers[i];
      const existing = await User.findOne({ email: u.email });
      if (!existing) {
        const staff = new User({
          name: u.name,
          email: u.email,
          password: 'Staff@123',
          phone: u.phone,
          role: u.role,
          title: u.title,
          branch: u.branch,
          status: u.status,
          avatar: u.avatar
        });
        await staff.save();
        console.log(`   + Added staff: ${u.name} (${u.title})`);
      }
    }

    // 3. Seed loan applications
    console.log('\nSeeding loan applications...');
    for (const app of initialApplications) {
      const existingApp = await Loan.findOne({ applicationId: app.applicationId });
      if (!existingApp) {
        const newLoan = new Loan(app);
        await newLoan.save();
        console.log(`   + Added Application #${app.applicationId} (${app.applicantName} - ${app.loanType})`);
      }
    }

    // 4. Seed settings
    console.log('\nSeeding loan interest rate settings...');
    for (const s of initialSettings) {
      const existingSetting = await Setting.findOne({ loanType: s.loanType });
      if (!existingSetting) {
        const newSet = new Setting(s);
        await newSet.save();
        console.log(`   + Added settings for ${s.loanType}`);
      }
    }

    console.log('\n==================================================');
    console.log('🎉 SEEDING COMPLETE!');
    console.log('==================================================');
    console.log('Use the following credentials to login to the Admin Panel:');
    console.log(`URL:      http://localhost:5173/admin/login`);
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Role:     admin (Branch Manager)`);
    console.log('==================================================\n');

  } catch (error) {
    console.error('\n❌ Error during MongoDB seeding:', error.message);
    console.log('\n💡 Tip: If you do not have local MongoDB running:');
    console.log('   1. Start your local MongoDB server: mongod');
    console.log('   2. OR set MONGO_URI in server/.env with your MongoDB Atlas connection string.');
    console.log('   Note: The backend also has automatic in-memory mock fallback so the API & Admin UI works right away!\n');
  } finally {
    try {
      await mongoose.disconnect();
    } catch (e) {}
    process.exit(0);
  }
}

seedAdmin();

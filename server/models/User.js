const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { 
    type: String, 
    enum: ['admin', 'manager', 'officer', 'user'], 
    default: 'user' 
  },
  branch: { type: String, default: 'Vijayawada' },
  title: { type: String, default: 'Staff Officer' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  avatar: { type: String, default: '' },
  aadhaarNumber: { type: String },
  panNumber: { type: String },
  aadhaarDocUrl: { type: String },
  panDocUrl: { type: String },
  profilePicUrl: { type: String },
  history: [{
    action: { type: String, required: true },
    date: { type: Date, default: Date.now },
    details: { type: String }
  }]
}, { timestamps: true });

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

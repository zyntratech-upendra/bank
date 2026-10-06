const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // custom id like 'LOC001'
  city: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  services: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Location', locationSchema);

const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  department: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Token', TokenSchema);

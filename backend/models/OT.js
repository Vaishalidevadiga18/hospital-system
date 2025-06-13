const mongoose = require('mongoose');

const OTSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  status: { type: String, enum: ['scheduled', 'in-progress', 'completed', 'emergency'], default: 'scheduled' }
});

module.exports = mongoose.model('OT', OTSchema);

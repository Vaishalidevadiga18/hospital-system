const mongoose = require('mongoose');

const DrugSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  stock: { type: Number, required: true }
});

module.exports = mongoose.model('Drug', DrugSchema);

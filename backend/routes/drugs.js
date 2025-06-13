const express = require('express');
const router = express.Router();
const Drug = require('../models/Drug');

router.get('/', async (req, res) => {
  const drugs = await Drug.find();
  res.json(drugs);
});

router.post('/', async (req, res) => {
  const { name, dosage, stock } = req.body;
  if (!name || !dosage || stock == null) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const newDrug = new Drug({ name, dosage, stock });
  await newDrug.save();
  res.status(201).json(newDrug);
});

router.put('/:id', async (req, res) => {
  const { name, dosage, stock } = req.body;
  const updated = await Drug.findByIdAndUpdate(req.params.id, { name, dosage, stock }, { new: true });
  if (!updated) return res.status(404).json({ error: 'Drug not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Drug.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Drug not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;

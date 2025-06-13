const express = require('express');
const router = express.Router();
const OT = require('../models/OT');

router.get('/', async (req, res) => {
  const ots = await OT.find();
  res.json(ots);
});

router.post('/', async (req, res) => {
  const { patientName, scheduledTime, status } = req.body;
  if (!patientName || !scheduledTime) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const newOt = new OT({ patientName, scheduledTime, status });
  await newOt.save();
  res.status(201).json(newOt);
});

router.put('/:id', async (req, res) => {
  const { patientName, scheduledTime, status } = req.body;
  const updated = await OT.findByIdAndUpdate(req.params.id, { patientName, scheduledTime, status }, { new: true });
  if (!updated) return res.status(404).json({ error: 'OT not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await OT.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'OT not found' });
  res.json({ message: 'Deleted' });
});

module.exports = router;

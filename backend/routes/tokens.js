const express = require('express');
const router = express.Router();
const Token = require('../models/Token');

// Get all tokens
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: 1 });
    res.json(tokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new token
router.post('/', async (req, res) => {
  const { patientName, department } = req.body;
  if (!patientName || !department) {
    return res.status(400).json({ error: 'patientName and department are required' });
  }
  try {
    const newToken = new Token({ patientName, department });
    const savedToken = await newToken.save();
    res.status(201).json(savedToken);
  } catch (error) {
    console.error('Error saving token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

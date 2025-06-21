const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Simulate reading players from a log or saved file
router.get('/', (req, res) => {
  try {
    const playersFilePath = path.join(__dirname, '../../data/players.json');

    if (!fs.existsSync(playersFilePath)) {
      console.warn('players.json does not exist, returning empty array');
      return res.json([]);
    }

    const content = fs.readFileSync(playersFilePath, 'utf-8');
    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) {
      console.warn('Expected an array in players.json but got:', typeof parsed);
      return res.json([]); // Fail-safe fallback
    }

    res.json(parsed);
  } catch (err) {
    console.error('Error reading players:', err);
    res.status(500).json({ error: 'Failed to load player list' });
  }
});

module.exports = router;

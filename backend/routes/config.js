const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const ini = require('ini');

const configDir = path.join(__dirname, '..', 'config');

router.get('/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(configDir, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Config file not found' });
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = ini.parse(content);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read config file' });
  }
});

router.post('/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(configDir, filename);
  const data = req.body;

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Config file not found' });
  }

  try {
    const stringified = ini.stringify(data);
    fs.writeFileSync(filePath, stringified, 'utf-8');
    res.json({ status: 'Config saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to write config file' });
  }
});

module.exports = router;

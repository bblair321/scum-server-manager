// backend/routes/server.js
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();

let serverProcess = null;

router.post('/start', (req, res) => {
  if (serverProcess) {
    return res.status(400).json({ error: 'Server is already running.' });
  }

  // Adjust the path to your SCUMServer.bat file
    serverProcess = exec('start "" "C:\\ScumServer\\SCUMServer.bat"', (err) => {
    if (err) {
      console.error('Error starting server:', err);
    }
  });

  res.json({ status: 'Server starting...' });
});

router.post('/stop', (req, res) => {
  if (!serverProcess) {
    return res.status(400).json({ error: 'Server is not running.' });
  }

  exec('taskkill /IM SCUMServer.exe /F', (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to stop the server.' });
    }
    serverProcess = null;
    res.json({ status: 'Server stopped.' });
  });
});

module.exports = router;

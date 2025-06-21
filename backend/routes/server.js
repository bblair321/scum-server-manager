const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const router = express.Router();

let serverProcess = null;

const serverBatPath = 'C:\\ScumServer\\SCUMServer.bat'; // Update this path if needed

// Start SCUM server
router.post('/start', (req, res) => {
  if (serverProcess) {
    return res.status(400).json({ error: 'Server is already running.' });
  }

  const command = `start "" "${serverBatPath}"`;

  serverProcess = exec(command, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      return res.status(500).json({ error: 'Failed to start server.' });
    }
  });

  res.json({ status: 'Server starting...' });
});

// Stop SCUM server
router.post('/stop', (req, res) => {
  if (!serverProcess) {
    return res.status(400).json({ error: 'Server is not running.' });
  }

  exec('taskkill /IM SCUMServer.exe /F', (err) => {
    if (err) {
      console.error('Failed to stop server:', err);
      return res.status(500).json({ error: 'Failed to stop server.' });
    }

    serverProcess = null;
    res.json({ status: 'Server stopped.' });
  });
});

// Check if SCUM server is running
router.get('/status', (req, res) => {
  try {
    const output = execSync('tasklist').toString();
    const isRunning = output.toLowerCase().includes('scumserver.exe');
    res.json({ running: isRunning });
  } catch (err) {
    console.error('Error checking server status:', err);
    res.status(500).json({ error: 'Could not check server status' });
  }
});

module.exports = router;

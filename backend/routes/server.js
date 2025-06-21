const express = require('express');
const { exec, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();
let serverProcess = null;

// Helper to get saved SCUM server path
function getServerPath() {
  const configPath = path.join(process.cwd(), 'server-path.json');
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf-8');
      const json = JSON.parse(raw);
      return json.path;
    } catch {
      return null;
    }
  }
  return null;
}

// Start SCUM server
router.post('/start', (req, res) => {
  console.log('POST /start called');

  if (serverProcess) {
    console.log('Server is already running');
    return res.status(400).json({ error: 'Server is already running.' });
  }

  const serverPath = getServerPath();
  console.log('Configured server path:', serverPath);

  if (!serverPath || !fs.existsSync(serverPath)) {
    console.log('Invalid server path');
    return res.status(400).json({ error: 'Invalid server path.' });
  }

  const command = `start "" "${serverPath}"`;

  const child = exec(command, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      serverProcess = null;
    }
  });

  serverProcess = child;
  res.json({ status: 'Server starting...' });
});

// Stop SCUM server
router.post('/stop', (req, res) => {
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

// Get current server path
router.get('/path', (req, res) => {
  try {
    const configPath = path.join(process.cwd(), 'server-path.json');
    const data = fs.readFileSync(configPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load server path.' });
  }
});

// Update server path
router.post('/path', (req, res) => {
  try {
    const { path: newPath } = req.body;
    const configPath = path.join(process.cwd(), 'server-path.json'); // ✅ CORRECT
    fs.writeFileSync(configPath, JSON.stringify({ path: newPath }, null, 2));
    res.json({ status: 'Saved.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save server path.' });
  }
});

module.exports = router;

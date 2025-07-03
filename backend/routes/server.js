const express = require('express');
const { exec, execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const router = express.Router();
let serverProcess = null;

// Config file paths
const serverPathFile = path.join(process.cwd(), 'server-path.json');
const logPathFile = path.join(process.cwd(), 'log-path.json');

// Helpers
function getJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading JSON from ${filePath}:`, err);
    return null;
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing JSON to ${filePath}:`, err);
    return false;
  }
}

function getServerPath() {
  const config = getJSON(serverPathFile);
  return config?.path ? path.normalize(config.path) : null;
}

// Routes

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

  try {
    serverProcess = spawn(`"${serverPath}"`, {
      shell: true,
      detached: true,
      stdio: 'ignore',
    });
    serverProcess.unref();
    res.json({ status: 'Server starting...' });
  } catch (err) {
    console.error('Failed to start server:', err);
    serverProcess = null;
    res.status(500).json({ error: 'Failed to start server.' });
  }
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

// Check server status
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

// Get server path
router.get('/path', (req, res) => {
  const config = getJSON(serverPathFile);
  if (config?.path) return res.json({ path: config.path });
  res.json({ path: '' });
});

// Update server path
router.post('/path', (req, res) => {
  const { path: newPath } = req.body;
  if (!newPath) return res.status(400).json({ error: 'Missing path in request.' });

  const success = writeJSON(serverPathFile, { path: newPath });
  if (success) return res.json({ status: 'Saved.' });
  res.status(500).json({ error: 'Failed to save server path.' });
});

// Get log path
router.get('/log-path', (req, res) => {
  const config = getJSON(logPathFile);
  if (config?.logPath) return res.json({ logPath: config.logPath });
  res.json({ logPath: '' });
});

// Update log path
router.post('/log-path', (req, res) => {
  const { logPath } = req.body;
  if (!logPath) return res.status(400).json({ error: 'Missing logPath in request.' });

  const success = writeJSON(logPathFile, { logPath });
  if (success) return res.json({ status: 'Saved.' });
  res.status(500).json({ error: 'Failed to save log path.' });
});

module.exports = router;

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/server', require('./routes/server'));
app.use('/api/config', require('./routes/config'));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'build')));

// React fallback route (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start backend server
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server Manager API running on http://localhost:${port}`);
});

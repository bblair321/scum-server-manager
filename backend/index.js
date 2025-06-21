const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/server', require('./routes/server'));
app.use('/api/config', require('./routes/config'));
app.use('/api/players', require('./routes/players'));

app.listen(port, () => {
  console.log(`Server Manager API running on port ${port}`);
});

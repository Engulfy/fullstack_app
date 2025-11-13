// central Express app configuration
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  if (req.method !== 'GET') console.log('  body:', req.body);
  next();
});

// simple health endpoint
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => {
  res.json({ message: 'API running. Use /health, /cafes, or /employees. Frontend is served separately by Vite.' });
});

const cafeRoutes = require('./routes/cafes');
const employeeRoutes = require('./routes/employees');

app.use('/cafes', cafeRoutes);
app.use('/employees', employeeRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;

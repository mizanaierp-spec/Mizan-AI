const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const winston = require('winston');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    name: 'Mizan AI',
    version: '1.0.0'
  });
});

app.use('/api/auth', require('./api/auth/routes'));
app.use('/api/companies', require('./api/companies/routes'));
app.use('/api/users', require('./api/users/routes'));
app.use('/api/chart-of-accounts', require('./api/accounting/chartOfAccounts/routes'));
app.use('/api/journal-entries', require('./api/accounting/journalEntries/routes'));
app.use('/api/customers', require('./api/customers/routes'));
app.use('/api/suppliers', require('./api/suppliers/routes'));
app.use('/api/inventory', require('./api/inventory/routes'));
app.use('/api/cash', require('./api/cash/routes'));
app.use('/api/bank', require('./api/bank/routes'));
app.use('/api/payroll', require('./api/payroll/routes'));
app.use('/api/assets', require('./api/assets/routes'));
app.use('/api/reports', require('./api/reports/routes'));
app.use('/api/settings', require('./api/settings/routes'));
app.use('/api/audit', require('./api/audit/routes'));
app.use('/api/ai', require('./ai/routes'));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack, url: req.originalUrl });
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Mizan AI backend is running on port ${PORT}`);
  });
}

module.exports = app;

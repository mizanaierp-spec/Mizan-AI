const { rateLimit } = require('./rateLimit');

const apiRateLimit = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  max: Number(process.env.RATE_LIMIT_MAX || 300)
});

const authRateLimit = rateLimit({
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 900000),
  max: Number(process.env.AUTH_RATE_LIMIT_MAX || 20)
});

module.exports = { apiRateLimit, authRateLimit };

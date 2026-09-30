const buckets = new Map();

function getClientKey(req) {
  return req.ip || req.socket?.remoteAddress || 'unknown';
}

function rateLimit({ windowMs = 15 * 60 * 1000, max = 100 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = getClientKey(req);
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    current.count += 1;
    if (current.count > max) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({ success: false, message: 'Too many requests' });
    }

    return next();
  };
}

module.exports = { rateLimit };

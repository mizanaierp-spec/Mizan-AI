const db = require('../config/database');

function auditMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    if (req.user && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      const companyId = req.user.company_id || req.body?.company_id || null;
      db.query(
        `INSERT INTO audit_log (company_id, user_id, action, resource, details, ip_address)
         VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
        [
          companyId,
          req.user.id,
          req.method,
          req.originalUrl,
          JSON.stringify({ body: req.body, params: req.params }),
          req.ip
        ]
      ).catch((error) => console.error('Audit log failed:', error.message));
    }

    return originalJson(body);
  };

  next();
}

module.exports = { auditMiddleware };

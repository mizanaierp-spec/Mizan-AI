const db = require('../../config/database');
const { auth, authorize } = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    
    const result = await db.query(
      'SELECT * FROM audit_log WHERE company_id = $1 ORDER BY timestamp DESC LIMIT 100',
      [companyId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const db = require('../../config/database');

router.get('/', auth, authorize(['admin', 'manager', 'accountant', 'monitor']), async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

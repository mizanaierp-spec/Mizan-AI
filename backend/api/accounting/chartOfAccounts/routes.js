const express = require('express');
const router = express.Router();
const db = require('../../../config/database');
const { auth, authorize } = require('../../../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { company_id } = req.query;
    const result = await db.query(
      'SELECT * FROM chart_of_accounts WHERE company_id = $1 ORDER BY account_code ASC',
      [company_id]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize(['admin', 'accountant', 'manager']), async (req, res) => {
  try {
    const { company_id, account_code, account_name, account_type, parent_id } = req.body;

    const exists = await db.query(
      'SELECT id FROM chart_of_accounts WHERE company_id = $1 AND account_code = $2',
      [company_id, account_code]
    );

    if (exists.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Account code already exists' });
    }

    const result = await db.query(
      `INSERT INTO chart_of_accounts (company_id, account_code, account_name, account_type, parent_id, created_by, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [company_id, account_code, account_name, account_type, parent_id || null, req.user.id]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

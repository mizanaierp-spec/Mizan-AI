const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { auth, authorize } = require('../../middleware/auth');

router.get('/accounts', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    const result = await db.query('SELECT * FROM bank_accounts WHERE company_id = $1 ORDER BY bank_name', [companyId]);
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.post('/accounts', auth, authorize(['admin', 'manager', 'accountant', 'cashier']), async (req, res) => {
  try {
    const { company_id, bank_name, account_number, account_holder, currency = 'SAR' } = req.body;
    if (!company_id || !bank_name) return res.status(400).json({ success: false, message: 'company_id and bank_name are required' });
    const result = await db.query(
      `INSERT INTO bank_accounts (company_id, bank_name, account_number, account_holder, currency)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_id, bank_name, account_number || null, account_holder || null, currency]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;

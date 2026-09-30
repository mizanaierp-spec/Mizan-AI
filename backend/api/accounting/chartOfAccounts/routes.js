const db = require('../../config/database');
const { auth, authorize } = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    
    const result = await db.query(
      'SELECT * FROM chart_of_accounts WHERE company_id = $1 ORDER BY account_code',
      [companyId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const { company_id, account_code, account_name, account_type } = req.body;
    if (!company_id || !account_code || !account_name || !account_type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const result = await db.query(
      `INSERT INTO chart_of_accounts (company_id, account_code, account_name, account_type, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_id, account_code, account_name, account_type, req.user.id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:id', auth, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const { id } = req.params;
    const { account_name, account_type } = req.body;

    const result = await db.query(
      `UPDATE chart_of_accounts SET account_name = COALESCE($1, account_name), account_type = COALESCE($2, account_type)
       WHERE id = $3 RETURNING *`,
      [account_name, account_type, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM chart_of_accounts WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }
    res.json({ success: true, message: 'Account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

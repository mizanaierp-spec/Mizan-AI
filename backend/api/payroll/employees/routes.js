const express = require('express');
const router = express.Router();
const db = require('../../../config/database');
const { auth, authorize } = require('../../../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    const result = await db.query('SELECT * FROM employees WHERE company_id = $1 ORDER BY name', [companyId]);
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.post('/', auth, authorize(['admin', 'manager', 'hr']), async (req, res) => {
  try {
    const { company_id, employee_id, name, position, salary, bank_account } = req.body;
    if (!company_id || !name) return res.status(400).json({ success: false, message: 'company_id and name are required' });
    const result = await db.query(
      `INSERT INTO employees (company_id, employee_id, name, position, salary, bank_account)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company_id, employee_id || null, name, position || null, Number(salary || 0), bank_account || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;

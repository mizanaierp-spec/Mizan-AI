const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { auth, authorize } = require('../../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    const params = [companyId];
    let sql = 'SELECT * FROM payroll WHERE company_id = $1';
    if (req.query.period) { params.push(req.query.period); sql += ' AND period = $2'; }
    sql += ' ORDER BY created_at DESC';
    const result = await db.query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.post('/', auth, authorize(['admin', 'manager', 'accountant', 'hr']), async (req, res) => {
  try {
    const { company_id, employee_id, period, salary, allowances = 0, deductions = 0 } = req.body;
    if (!company_id || !employee_id || !period) return res.status(400).json({ success: false, message: 'company_id, employee_id and period are required' });
    const netSalary = Number(salary || 0) + Number(allowances) - Number(deductions);
    if (netSalary < 0) return res.status(400).json({ success: false, message: 'net salary cannot be negative' });
    const result = await db.query(
      `INSERT INTO payroll (company_id, employee_id, period, salary, allowances, deductions, net_salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [company_id, employee_id, period, Number(salary || 0), Number(allowances), Number(deductions), netSalary]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;

const db = require('../../config/database');
const { auth, authorize } = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    
    const result = await db.query(
      'SELECT * FROM fixed_assets WHERE company_id = $1 ORDER BY asset_name',
      [companyId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const { company_id, asset_name, acquisition_date, cost, useful_life_years = 5 } = req.body;
    if (!company_id || !asset_name || !cost) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const monthlyDepreciation = (Number(cost) / (useful_life_years * 12)).toFixed(2);
    const result = await db.query(
      `INSERT INTO fixed_assets (company_id, asset_name, acquisition_date, cost, useful_life_years, monthly_depreciation)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company_id, asset_name, acquisition_date || new Date(), Number(cost), useful_life_years, monthlyDepreciation]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

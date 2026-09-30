const db = require('../../config/database');
const { auth, authorize } = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    
    const result = await db.query(
      'SELECT * FROM inventory_items WHERE company_id = $1 ORDER BY item_code',
      [companyId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize(['admin', 'manager']), async (req, res) => {
  try {
    const { company_id, item_code, item_name, unit, category } = req.body;
    if (!company_id || !item_code || !item_name) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    
    const result = await db.query(
      `INSERT INTO inventory_items (company_id, item_code, item_name, unit, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [company_id, item_code, item_name, unit || null, category || null]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.module = router;

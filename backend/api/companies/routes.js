const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const db = require('../../config/database');

router.get('/', auth, async (req, res) => {
  try {
    const companyId = req.query.company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });
    
    const result = await db.query('SELECT * FROM companies WHERE id = $1', [companyId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, tax_id, email, phone, address, city, country } = req.body;
    const result = await db.query(
      `INSERT INTO companies (name, tax_id, email, phone, address, city, country, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, tax_id || null, email || null, phone || null, address || null, city || null, country || null, req.user.id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

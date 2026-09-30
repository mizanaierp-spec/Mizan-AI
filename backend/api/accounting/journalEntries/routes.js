const db = require('../../config/database');
const { auth, authorize } = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const { company_id, period_id } = req.query;
    const companyId = company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });

    let sql = 'SELECT * FROM journal_entries WHERE company_id = $1';
    const params = [companyId];
    
    if (period_id) {
      params.push(period_id);
      sql += ` AND period_id = $${params.length}`;
    }
    
    sql += ' ORDER BY entry_date DESC';
    const result = await db.query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const { company_id, description, lines } = req.body;
    if (!company_id || !Array.isArray(lines) || lines.length < 2) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const entryResult = await client.query(
        `INSERT INTO journal_entries (company_id, description, created_by, status)
         VALUES ($1, $2, $3, 'draft') RETURNING *`,
        [company_id, description, req.user.id]
      );
      const entry = entryResult.rows[0];

      for (const line of lines) {
        await client.query(
          `INSERT INTO journal_lines (entry_id, account_id, debit, credit)
           VALUES ($1, $2, $3, $4)`,
          [entry.id, line.account_id, Number(line.debit || 0), Number(line.credit || 0)]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({ success: true, data: entry });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:id/post', auth, authorize(['admin', 'accountant']), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      `UPDATE journal_entries SET status = 'posted', posted_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

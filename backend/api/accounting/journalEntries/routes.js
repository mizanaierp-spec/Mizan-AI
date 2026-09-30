const express = require('express');
const router = express.Router();
const db = require('../../../config/database');
const { auth, authorize } = require('../../../middleware/auth');
const JournalService = require('../../../services/accounting/JournalService');

router.get('/', auth, async (req, res) => {
  try {
    const { company_id, period_id } = req.query;

    const result = await db.query(
      `SELECT * FROM journal_entries WHERE company_id = $1 AND period_id = $2 ORDER BY entry_date DESC, entry_number DESC`,
      [company_id, period_id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', auth, authorize(['admin', 'accountant', 'manager']), async (req, res) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const { company_id, period_id, description, lines } = req.body;

    if (!lines || lines.length === 0) {
      return res.status(400).json({ success: false, message: 'Journal entry must include lines' });
    }

    const totalDebit = lines.reduce((sum, line) => sum + Number(line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + Number(line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({ success: false, message: 'Journal entry is not balanced' });
    }

    const countResult = await client.query(
      'SELECT COUNT(*) as count FROM journal_entries WHERE company_id = $1 AND period_id = $2',
      [company_id, period_id]
    );

    const entryNumber = Number(countResult.rows[0].count) + 1;

    const entryResult = await client.query(
      `INSERT INTO journal_entries (company_id, period_id, entry_number, description, entry_date, created_by, status, created_at)
       VALUES ($1, $2, $3, $4, NOW(), $5, 'draft', NOW())
       RETURNING *`,
      [company_id, period_id, entryNumber, description, req.user.id]
    );

    const entry = entryResult.rows[0];

    for (const line of lines) {
      await client.query(
        `INSERT INTO journal_lines (entry_id, account_id, description, debit, credit, created_at)
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [entry.id, line.account_id, line.description || '', Number(line.debit || 0), Number(line.credit || 0)]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
});

router.post('/:id/post', auth, authorize(['admin', 'accountant', 'manager']), async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE journal_entries SET status = $1, posted_at = NOW() WHERE id = $2 RETURNING *',
      ['posted', req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Journal entry not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/trial-balance', auth, async (req, res) => {
  try {
    const { company_id, period_id } = req.query;
    const data = await JournalService.getTrialBalance(company_id, period_id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

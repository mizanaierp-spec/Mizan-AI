const express = require('express');
const router = express.Router();
const db = require('../../config/database');
const { auth } = require('../../middleware/auth');

router.get('/trial-balance', auth, async (req, res) => {
  try {
    const { company_id, period_id } = req.query;

    const result = await db.query(
      `SELECT
         coa.account_code,
         coa.account_name,
         coa.account_type,
         COALESCE(SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE 0 END), 0) AS debit,
         COALESCE(SUM(CASE WHEN jl.credit > 0 THEN jl.credit ELSE 0 END), 0) AS credit
       FROM chart_of_accounts coa
       LEFT JOIN journal_lines jl ON coa.id = jl.account_id
       LEFT JOIN journal_entries je ON jl.entry_id = je.id
       WHERE coa.company_id = $1 AND je.period_id = $2
       GROUP BY coa.id, coa.account_code, coa.account_name, coa.account_type
       ORDER BY coa.account_code`,
      [company_id, period_id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/profit-loss', auth, async (req, res) => {
  try {
    const { company_id, period_id } = req.query;

    const result = await db.query(
      `SELECT
         coa.account_type,
         coa.account_name,
         COALESCE(SUM(CASE WHEN coa.account_type IN ('revenue', 'income') THEN jl.credit - jl.debit
                          WHEN coa.account_type IN ('expense', 'cost') THEN jl.debit - jl.credit
                          ELSE 0 END), 0) AS amount
       FROM chart_of_accounts coa
       LEFT JOIN journal_lines jl ON coa.id = jl.account_id
       LEFT JOIN journal_entries je ON jl.entry_id = je.id
       WHERE coa.company_id = $1 AND je.period_id = $2
       GROUP BY coa.account_type, coa.account_name
       ORDER BY coa.account_type, coa.account_name`,
      [company_id, period_id]
    );

    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

const db = require('../../config/database');
const { auth } = require('../../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/trial-balance', auth, async (req, res) => {
  try {
    const { company_id, period_id } = req.query;
    const companyId = company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });

    const result = await db.query(
      `SELECT 
        coa.id,
        coa.account_code,
        coa.account_name,
        COALESCE(SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE 0 END), 0) as debit,
        COALESCE(SUM(CASE WHEN jl.credit > 0 THEN jl.credit ELSE 0 END), 0) as credit
      FROM chart_of_accounts coa
      LEFT JOIN journal_lines jl ON jl.account_id = coa.id
      LEFT JOIN journal_entries je ON je.id = jl.entry_id
      WHERE coa.company_id = $1 AND (je.status = 'posted' OR je.status IS NULL)
      GROUP BY coa.id, coa.account_code, coa.account_name
      ORDER BY coa.account_code`,
      [companyId]
    );
    
    const totals = {
      debit: result.rows.reduce((sum, row) => sum + Number(row.debit || 0), 0),
      credit: result.rows.reduce((sum, row) => sum + Number(row.credit || 0), 0)
    };

    res.json({ success: true, data: { accounts: result.rows, totals } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/general-ledger', auth, async (req, res) => {
  try {
    const { company_id, account_id } = req.query;
    const companyId = company_id || req.user.company_id;
    if (!companyId) return res.status(400).json({ success: false, message: 'company_id required' });

    let sql = `SELECT jl.*, coa.account_code, coa.account_name, je.description, je.entry_date
               FROM journal_lines jl
               JOIN chart_of_accounts coa ON coa.id = jl.account_id
               JOIN journal_entries je ON je.id = jl.entry_id
               WHERE coa.company_id = $1`;
    const params = [companyId];

    if (account_id) {
      params.push(account_id);
      sql += ` AND jl.account_id = $${params.length}`;
    }

    sql += ' ORDER BY je.entry_date DESC';
    const result = await db.query(sql, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

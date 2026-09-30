const db = require('../../config/database');

class JournalService {
  static async getTrialBalance(company_id, period_id) {
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

    return result.rows;
  }

  static async verifyBalance(company_id, period_id) {
    const result = await db.query(
      `SELECT
         COALESCE(SUM(CASE WHEN jl.debit > 0 THEN jl.debit ELSE 0 END), 0) AS total_debit,
         COALESCE(SUM(CASE WHEN jl.credit > 0 THEN jl.credit ELSE 0 END), 0) AS total_credit
       FROM journal_lines jl
       JOIN journal_entries je ON jl.entry_id = je.id
       WHERE je.company_id = $1 AND je.period_id = $2`,
      [company_id, period_id]
    );

    const { total_debit, total_credit } = result.rows[0];
    return Math.abs(Number(total_debit) - Number(total_credit)) < 0.01;
  }
}

module.exports = JournalService;

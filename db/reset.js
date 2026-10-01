const db = require('../backend/config/database');
const fs = require('fs');
const path = require('path');

async function reset() {
  try {
    console.log('⚠️  Resetting database...');
    
    // Drop all tables
    await db.query(`
      DROP TABLE IF EXISTS audit_log CASCADE;
      DROP TABLE IF EXISTS ai_logs CASCADE;
      DROP TABLE IF EXISTS ai_execution_logs CASCADE;
      DROP TABLE IF EXISTS journal_lines CASCADE;
      DROP TABLE IF EXISTS journal_entries CASCADE;
      DROP TABLE IF EXISTS periods CASCADE;
      DROP TABLE IF EXISTS payroll CASCADE;
      DROP TABLE IF EXISTS employees CASCADE;
      DROP TABLE IF EXISTS fixed_assets CASCADE;
      DROP TABLE IF EXISTS bank_accounts CASCADE;
      DROP TABLE IF EXISTS cash_boxes CASCADE;
      DROP TABLE IF EXISTS inventory_items CASCADE;
      DROP TABLE IF EXISTS suppliers CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;
      DROP TABLE IF EXISTS chart_of_accounts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS companies CASCADE;
    `);
    
    console.log('✓ Tables dropped');
    
    // Run migrations
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    await db.query(schema);
    
    console.log('✓ Schema created');
    
    // Run seeds
    const { execSync } = require('child_process');
    execSync('node db/seed.js', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
}

reset();

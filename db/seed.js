const db = require('../../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create default company
    const companyResult = await db.query(
      `INSERT INTO companies (name, tax_id, email, phone, address, city, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      ['Mizan AI Demo Company', '1234567890', 'info@mizan.local', '+966123456789', '123 Business St', 'Riyadh', 'Saudi Arabia']
    );
    
    let companyId = companyResult.rows[0]?.id;
    
    if (!companyId) {
      const existing = await db.query('SELECT id FROM companies LIMIT 1');
      companyId = existing.rows[0]?.id || 1;
    }

    console.log(`✓ Company ID: ${companyId}`);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminResult = await db.query(
      `INSERT INTO users (company_id, email, name, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING
       RETURNING *`,
      [companyId, 'admin@mizan.local', 'Admin User', adminPassword, 'admin']
    );
    
    console.log('✓ Admin user created');

    // Create sample accounts
    const accounts = [
      { code: '1010', name: 'الصندوق', type: 'asset' },
      { code: '1020', name: 'البنك', type: 'asset' },
      { code: '1030', name: 'الذمم المدينة', type: 'asset' },
      { code: '2010', name: 'الذمم الدائنة', type: 'liability' },
      { code: '3010', name: 'رأس المال', type: 'equity' },
      { code: '4010', name: 'المبيعات', type: 'revenue' },
      { code: '5010', name: 'تكلفة البيع', type: 'expense' }
    ];

    for (const account of accounts) {
      await db.query(
        `INSERT INTO chart_of_accounts (company_id, account_code, account_name, account_type, created_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [companyId, account.code, account.name, account.type, adminResult.rows[0]?.id || 1]
      );
    }
    
    console.log('✓ Sample accounts created');

    // Create sample period
    await db.query(
      `INSERT INTO periods (company_id, period_name, start_date, end_date, is_closed)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [companyId, '2026-01', '2026-01-01', '2026-01-31', false]
    );
    
    console.log('✓ Sample period created');

    // Create sample cash box
    await db.query(
      `INSERT INTO cash_boxes (company_id, name, currency, balance)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [companyId, 'الصندوق الرئيسي', 'SAR', 0]
    );
    
    console.log('✓ Sample cash box created');

    // Create sample bank account
    await db.query(
      `INSERT INTO bank_accounts (company_id, bank_name, account_number, account_holder, currency, balance)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT DO NOTHING`,
      [companyId, 'البنك الأهلي', 'SA1234567890', 'Mizan AI', 'SAR', 0]
    );
    
    console.log('✓ Sample bank account created');

    console.log('\n✅ Database seeding completed successfully!');
    console.log(`\n🔐 Login Credentials:\n  Email: admin@mizan.local\n  Password: admin123\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();

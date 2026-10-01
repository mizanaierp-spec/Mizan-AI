const fs = require('fs');
const path = require('path');

const checks = [
  {
    name: 'Database Connection',
    check: async () => {
      const db = require('../backend/config/database');
      await db.query('SELECT 1');
      return true;
    }
  },
  {
    name: 'JWT Configuration',
    check: () => !!process.env.JWT_SECRET,
  },
  {
    name: 'Environment Setup',
    check: () => {
      const required = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
      return required.every(v => process.env[v]);
    }
  },
  {
    name: 'Logs Directory',
    check: () => {
      const dir = './logs';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return true;
    }
  },
  {
    name: 'Backups Directory',
    check: () => {
      const dir = './backups';
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      return true;
    }
  }
];

async function runHealthCheck() {
  console.log('🏥 Running health checks...\n');
  
  let passed = 0;
  let failed = 0;
  
  for (const check of checks) {
    try {
      const result = await check.check();
      if (result) {
        console.log(`✓ ${check.name}`);
        passed++;
      } else {
        console.log(`✗ ${check.name}`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ ${check.name}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('✅ All checks passed!');
    process.exit(0);
  } else {
    console.log('❌ Some checks failed!');
    process.exit(1);
  }
}

runHealthCheck();

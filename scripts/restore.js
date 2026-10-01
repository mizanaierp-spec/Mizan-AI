const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKUP_DIR = path.join(__dirname, '../backups');

async function restore(backupFile) {
  try {
    if (!backupFile) {
      // List available backups
      console.log('📋 Available backups:');
      const backups = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('mizan_backup_'))
        .sort()
        .reverse();
      
      if (backups.length === 0) {
        console.log('  No backups found');
        process.exit(0);
      }
      
      backups.forEach((b, i) => {
        const stats = fs.statSync(path.join(BACKUP_DIR, b));
        console.log(`  ${i + 1}. ${b} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
      });
      
      console.log('\n⚠️  Usage: node scripts/restore.js <backup-file>');
      process.exit(0);
    }

    const fullPath = path.join(BACKUP_DIR, backupFile);
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ Backup file not found: ${backupFile}`);
      process.exit(1);
    }

    console.log('🔄 Starting database restore...');
    console.log(`   File: ${backupFile}`);
    console.log('   ⚠️  This will overwrite the current database!');
    
    const command = `PGPASSWORD=${process.env.DB_PASSWORD} psql -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} < ${fullPath}`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log('✓ Restore completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Restore failed:', error.message);
    process.exit(1);
  }
}

restore(process.argv[2]);

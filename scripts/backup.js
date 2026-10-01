const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const db = require('../backend/config/database');

const BACKUP_DIR = path.join(__dirname, '../backups');

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function backup() {
  try {
    console.log('📦 Starting database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUP_DIR, `mizan_backup_${timestamp}.sql`);
    
    const command = `PGPASSWORD=${process.env.DB_PASSWORD} pg_dump -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} > ${backupFile}`;
    
    execSync(command, { stdio: 'inherit' });
    
    const stats = fs.statSync(backupFile);
    console.log(`✓ Backup completed: ${backupFile}`);
    console.log(`  Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  Timestamp: ${timestamp}`);
    
    // Keep only last 10 backups
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('mizan_backup_'))
      .sort()
      .reverse();
    
    if (backups.length > 10) {
      console.log(`🧹 Cleaning up old backups (keeping latest 10)...`);
      backups.slice(10).forEach(backup => {
        const file = path.join(BACKUP_DIR, backup);
        fs.unlinkSync(file);
        console.log(`  Deleted: ${backup}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
}

backup();

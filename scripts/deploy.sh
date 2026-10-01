#!/bin/bash

set -e

echo "🚀 Deploying Mizan AI to production..."

# Pull latest changes
echo ""
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install --production
cd frontend && npm install --production && cd ..

# Build frontend
echo ""
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

# Backup database
echo ""
echo "💾 Backing up database..."
node scripts/backup.js

# Run migrations
echo ""
echo "🔄 Running database migrations..."
npm run db:migrate

# Verify production
echo ""
echo "🔐 Verifying production setup..."
bash scripts/verify-production.sh

# Restart application
echo ""
echo "♻️  Restarting application..."
if command -v systemctl &> /dev/null; then
    sudo systemctl restart mizan-ai
    echo "✓ Application restarted via systemctl"
elif command -v pm2 &> /dev/null; then
    pm2 restart mizan-ai
    echo "✓ Application restarted via PM2"
else
    echo "⚠️  Manual restart required"
fi

echo ""
echo "✅ Deployment completed!"
echo ""
echo "📊 Next steps:"
echo "   1. Verify application health: curl http://localhost:5000/api/health"
echo "   2. Check logs: tail -f ./logs/app.log"
echo "   3. Run smoke tests: npm run test:e2e"
echo ""

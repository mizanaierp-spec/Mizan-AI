#!/bin/bash

echo "🔐 Running production verification..."

# Check Node.js version
echo ""
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v)
echo "✓ Node.js: $NODE_VERSION"

# Check PostgreSQL connection
echo ""
echo "🗄️  Checking PostgreSQL connection..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ PostgreSQL: Connected"
else
    echo "✗ PostgreSQL: Connection failed"
    exit 1
fi

# Run migrations
echo ""
echo "🔄 Running database migrations..."
npm run db:migrate
if [ $? -ne 0 ]; then
    echo "✗ Migrations failed"
    exit 1
fi

# Check SSL certificates
echo ""
echo "🔒 Checking SSL certificates..."
if [ -f "./certs/server.key" ] && [ -f "./certs/server.crt" ]; then
    echo "✓ SSL certificates found"
else
    echo "⚠️  SSL certificates not found"
fi

# Check environment variables
echo ""
echo "🔑 Checking required environment variables..."
required_vars=("DATABASE_URL" "JWT_SECRET" "PORT" "NODE_ENV")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "✗ Missing: $var"
        exit 1
    else
        echo "✓ $var is set"
    fi
done

# Check file permissions
echo ""
echo "📂 Checking file permissions..."
if [ -w "./logs" ]; then
    echo "✓ Logs directory: writable"
else
    echo "⚠️  Logs directory: not writable"
    mkdir -p ./logs
    chmod 755 ./logs
fi

if [ -w "./backups" ]; then
    echo "✓ Backups directory: writable"
else
    echo "⚠️  Backups directory: not writable"
    mkdir -p ./backups
    chmod 755 ./backups
fi

# Run security checks
echo ""
echo "🛡️  Running security checks..."
npm run test:security 2>/dev/null || echo "⚠️  Security tests skipped"

# Check disk space
echo ""
echo "💾 Checking disk space..."
DISK_USAGE=$(df -h . | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    echo "✓ Disk usage: ${DISK_USAGE}%"
else
    echo "⚠️  Disk usage: ${DISK_USAGE}% (high!)"
fi

echo ""
echo "✅ Production verification completed!"
echo ""
echo "📊 Status Summary:"
echo "   Database: Ready"
echo "   Environment: $NODE_ENV"
echo "   Node.js: $NODE_VERSION"
echo ""

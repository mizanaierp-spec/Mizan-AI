#!/bin/bash

echo "🧹 Cleaning up production logs and temporary files..."

# Archive old logs
echo ""
echo "📦 Archiving logs older than 30 days..."
find ./logs -name "*.log" -mtime +30 -exec gzip {} \;
echo "✓ Logs archived"

# Clean up temporary files
echo ""
echo "🧹 Removing temporary files..."
find . -name "*.tmp" -delete
find . -name ".DS_Store" -delete
find . -name "thumbs.db" -delete
echo "✓ Temporary files cleaned"

# Clear node modules cache
echo ""
echo "💾 Clearing npm cache..."
npm cache clean --force
echo "✓ Cache cleared"

echo ""
echo "✅ Cleanup completed!"

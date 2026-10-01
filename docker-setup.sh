#!/bin/bash

echo "🐳 Building and starting Mizan AI with Docker..."

# Build and start services
docker-compose -f docker-compose.dev.yml up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker-compose -f docker-compose.dev.yml exec -T postgres pg_isready -U mizan > /dev/null 2>&1; then
        echo "✓ PostgreSQL is ready"
        break
    fi
    echo "  Waiting... ($i/30)"
    sleep 1
done

# Run migrations
echo "🗄️  Running database migrations..."
npm run db:migrate

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Docker setup completed!"
echo ""
echo "🎯 Start your services:"
echo "   Backend: npm run dev"
echo "   Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api/health"

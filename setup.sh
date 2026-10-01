#!/bin/bash

echo "🚀 Mizan AI - Automatic Setup"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✓ .env created"
fi

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo "🐳 Starting Docker containers..."
    docker-compose up -d
    
    # Wait for PostgreSQL to be ready
    echo "⏳ Waiting for PostgreSQL to be ready..."
    sleep 10
    
    echo "🗄️  Running database migrations..."
    npm run db:migrate
    
    echo "🌱 Seeding database..."
    npm run db:seed
else
    echo "⚠️  Docker not found. Make sure PostgreSQL is running locally."
    echo "   Run: npm run db:migrate && npm run db:seed"
fi

echo ""
echo "✅ Setup completed!"
echo ""
echo "🎯 Next steps:"
echo "   1. Backend: npm run dev"
echo "   2. Frontend: cd frontend && npm run dev"
echo ""
echo "🌐 Access the application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000/api/health"
echo ""
echo "🔐 Login with:"
echo "   Email:    admin@mizan.local"
echo "   Password: admin123"

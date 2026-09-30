# Deployment Guide

## Production deployment

### Prerequisites
- PostgreSQL database
- Redis instance
- Node.js 18+
- Railway or Docker hosting

### 1. Configure environment
Copy `.env.example` to `.env` and fill in real values.

### 2. Install dependencies
```bash
npm install
```

### 3. Create database
```bash
createdb mizan_ai
psql mizan_ai < db/schema.sql
psql mizan_ai < db/seed.sql
```

### 4. Run app
```bash
npm start
```

### 5. Verify health
```bash
curl http://localhost:3000/api/health
```

### 6. Deploy with Docker
```bash
docker-compose up --build
```

### 7. Deploy to Railway
- Push repo to GitHub
- Connect to Railway
- Add environment variables
- Deploy using `railway.json`

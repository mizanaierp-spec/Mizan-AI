# Mizan AI - Production Deployment Guide

## Environment Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04 LTS or later
- **Node.js**: 18.0.0+
- **PostgreSQL**: 12+
- **Redis**: 6.0+
- **Memory**: 4GB RAM
- **Disk**: 20GB SSD
- **CPU**: 2 cores minimum

### Recommended
- Ubuntu 22.04 LTS
- Node.js 18.16.0 LTS
- PostgreSQL 15
- Redis 7
- 8GB+ RAM
- 50GB+ SSD
- 4+ cores

## Pre-Deployment Checklist

```bash
# 1. System updates
sudo apt update && sudo apt upgrade -y

# 2. Install dependencies
sudo apt install -y curl git nodejs npm postgresql postgresql-contrib redis-server

# 3. Clone repository
git clone https://github.com/mizanaierp-spec/Mizan-AI.git
cd Mizan-AI

# 4. Setup environment
cp .env.example .env
# Edit .env with production values
nano .env

# 5. Install Node dependencies
npm install --production
cd frontend && npm install --production && cd ..

# 6. Build frontend
cd frontend
npm run build
cd ..
```

## Database Setup

```bash
# 1. Create PostgreSQL user and database
sudo -u postgres psql

# In psql:
CREATE USER mizan WITH PASSWORD 'strong_password';
CREATE DATABASE mizan_db OWNER mizan;
GRANT ALL PRIVILEGES ON DATABASE mizan_db TO mizan;
\q

# 2. Run migrations
npm run db:migrate

# 3. Seed initial data
npm run db:seed
```

## Docker Deployment

```bash
# 1. Build and run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# 2. Verify services
docker-compose ps

# 3. Check logs
docker-compose logs -f backend
```

## PM2 Deployment

```bash
# 1. Install PM2
npm install -g pm2

# 2. Start application
pm2 start ecosystem.config.js --env production

# 3. Monitor
pm2 monitor
pm2 logs

# 4. Setup startup
pm2 startup
pm2 save
```

## Systemd Deployment

```bash
# 1. Copy service file
sudo cp mizan-ai.service /etc/systemd/system/

# 2. Create user
sudo useradd -r -s /bin/bash mizan

# 3. Set permissions
sudo chown -R mizan:mizan /opt/mizan-ai

# 4. Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable mizan-ai
sudo systemctl start mizan-ai

# 5. Monitor
sudo systemctl status mizan-ai
sudo journalctl -u mizan-ai -f
```

## Nginx Configuration

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.mizan.local;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    listen [::]:80;
    server_name mizan.local;

    location / {
        root /opt/mizan-ai/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000/api;
    }
}
```

## SSL/TLS Setup with Let's Encrypt

```bash
# 1. Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# 2. Get certificate
sudo certbot certonly --nginx -d mizan.local -d api.mizan.local

# 3. Update Nginx config with SSL
# Reference: /etc/letsencrypt/live/mizan.local/

# 4. Auto-renewal
sudo systemctl enable certbot.timer
```

## Monitoring and Logging

```bash
# 1. View application logs
tail -f ./logs/app.log

# 2. Check database logs
tail -f /var/log/postgresql/postgresql-*.log

# 3. Monitor system
htop

# 4. Check disk space
df -h

# 5. Database backup
node scripts/backup.js

# 6. Restore from backup
node scripts/restore.js <backup-file>
```

## Maintenance

```bash
# 1. Daily health check
node scripts/health-check.js

# 2. Weekly cleanup
bash scripts/cleanup.sh

# 3. Monthly security hardening
bash scripts/harden-security.sh

# 4. Automated backups (cron)
0 2 * * * cd /opt/mizan-ai && node scripts/backup.js >> ./logs/backup.log 2>&1
```

## Verification Checklist

```bash
# Run verification
bash scripts/verify-production.sh

# Run tests
npm run test:e2e
npm run test:security

# Health check
curl http://localhost:5000/api/health

# Frontend check
curl http://localhost:3000
```

## Troubleshooting

### Database Connection Issues
```bash
# Test PostgreSQL
PGPASSWORD=password psql -h localhost -U mizan -d mizan_db -c "SELECT 1;"

# Check connection
netstat -tlnp | grep 5432
```

### High Memory Usage
```bash
# Check memory
free -h

# Restart application
pm2 restart all

# Check for memory leaks
pm2 logs
```

### Disk Space Issues
```bash
# Check usage
df -h

# Archive logs
bash scripts/cleanup.sh

# Remove old backups
ls -lht ./backups | tail -n +11 | awk '{print $NF}' | xargs rm -f
```

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Rotate JWT_SECRET regularly
3. ✅ Use strong database passwords
4. ✅ Enable firewall rules
5. ✅ Keep dependencies updated
6. ✅ Regular security audits
7. ✅ Implement rate limiting
8. ✅ Log all access and changes
9. ✅ Daily automated backups
10. ✅ Disaster recovery plan

## Support

For issues and questions:
- GitHub Issues: https://github.com/mizanaierp-spec/Mizan-AI/issues
- Documentation: https://github.com/mizanaierp-spec/Mizan-AI/wiki

---

**Last Updated**: October 2026
**Version**: 1.0.0 Production Ready

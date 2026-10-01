#!/bin/bash

# ================================================
# Mizan AI - Complete Production Deployment Guide
# ================================================
# This script automates the entire deployment process
# Usage: bash deploy-production.sh
# ================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/mizan-ai"
DOMAIN="mizan.local"
API_DOMAIN="api.mizan.local"
GIT_REPO="https://github.com/mizanaierp-spec/Mizan-AI.git"
APP_USER="mizan"
APP_GROUP="mizan"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Mizan AI - Production Deployment Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"

# ================================================
# STEP 1: PRE-DEPLOYMENT CHECKS
# ================================================
echo ""
echo -e "${YELLOW}[STEP 1/10] Running Pre-Deployment Checks...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}✗ This script must be run as root${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Running as root${NC}"

# Check system requirements
echo ""
echo "Checking system requirements..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker installed: $(docker --version)${NC}"

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose installed: $(docker-compose --version)${NC}"

if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Git installed: $(git --version)${NC}"

if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}⚠ Certbot not installed (installing...)${NC}"
    apt-get update > /dev/null
    apt-get install -y certbot python3-certbot-nginx > /dev/null
fi
echo -e "${GREEN}✓ Certbot installed${NC}"

# ================================================
# STEP 2: CREATE APP USER AND DIRECTORIES
# ================================================
echo ""
echo -e "${YELLOW}[STEP 2/10] Creating App User and Directories...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

if ! id "$APP_USER" &> /dev/null; then
    useradd -r -s /bin/bash -d $APP_DIR $APP_USER
    echo -e "${GREEN}✓ Created user: $APP_USER${NC}"
else
    echo -e "${GREEN}✓ User already exists: $APP_USER${NC}"
fi

mkdir -p $APP_DIR
mkdir -p $APP_DIR/logs
mkdir -p $APP_DIR/backups
mkdir -p $APP_DIR/certs
mkdir -p /var/log/nginx

chown -R $APP_USER:$APP_GROUP $APP_DIR
chmod 755 $APP_DIR

echo -e "${GREEN}✓ Created directories${NC}"

# ================================================
# STEP 3: CLONE OR UPDATE REPOSITORY
# ================================================
echo ""
echo -e "${YELLOW}[STEP 3/10] Cloning/Updating Repository...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

if [ -d "$APP_DIR/.git" ]; then
    echo "Updating existing repository..."
    cd $APP_DIR
    git pull origin main
    echo -e "${GREEN}✓ Repository updated${NC}"
else
    echo "Cloning repository..."
    git clone $GIT_REPO $APP_DIR
    echo -e "${GREEN}✓ Repository cloned${NC}"
fi

chown -R $APP_USER:$APP_GROUP $APP_DIR

# ================================================
# STEP 4: ENVIRONMENT CONFIGURATION
# ================================================
echo ""
echo -e "${YELLOW}[STEP 4/10] Configuring Environment...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

if [ ! -f "$APP_DIR/.env" ]; then
    echo "Creating .env file..."
    cp $APP_DIR/.env.production $APP_DIR/.env
    
    # Generate random secrets
    JWT_SECRET=$(openssl rand -base64 32)
    DB_PASSWORD=$(openssl rand -base64 16)
    REDIS_PASSWORD=$(openssl rand -base64 16)
    BACKUP_KEY=$(openssl rand -base64 32)
    
    # Update .env file
    sed -i "s|your-super-secret-jwt-key-change-in-production-min-32-chars|$JWT_SECRET|g" $APP_DIR/.env
    sed -i "s|change_this_password_in_production|$DB_PASSWORD|g" $APP_DIR/.env
    sed -i "s|REDIS_PASSWORD=change_this_password_in_production|REDIS_PASSWORD=$REDIS_PASSWORD|g" $APP_DIR/.env
    sed -i "s|your-backup-encryption-key-min-32-chars|$BACKUP_KEY|g" $APP_DIR/.env
    
    # Update domain names
    sed -i "s|db.mizan.local|postgres|g" $APP_DIR/.env
    sed -i "s|redis.mizan.local|redis|g" $APP_DIR/.env
    sed -i "s|https://mizan.local|https://$DOMAIN|g" $APP_DIR/.env
    sed -i "s|https://api.mizan.local|https://$API_DOMAIN|g" $APP_DIR/.env
    
    chmod 600 $APP_DIR/.env
    chown $APP_USER:$APP_GROUP $APP_DIR/.env
    
    echo -e "${GREEN}✓ Environment configured${NC}"
    echo -e "${YELLOW}⚠ Please review: $APP_DIR/.env${NC}
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# ================================================
# STEP 5: SSL CERTIFICATES
# ================================================
echo ""
echo -e "${YELLOW}[STEP 5/10] Setting Up SSL Certificates...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "Requesting SSL certificate from Let's Encrypt..."
    certbot certonly --standalone -d $DOMAIN -d $API_DOMAIN -d "www.$DOMAIN" -n --agree-tos -m admin@$DOMAIN
    echo -e "${GREEN}✓ SSL certificate obtained${NC}"
else
    echo -e "${GREEN}✓ SSL certificate already exists${NC}"
fi

# ================================================
# STEP 6: DOCKER SETUP
# ================================================
echo ""
echo -e "${YELLOW}[STEP 6/10] Building Docker Images...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

cd $APP_DIR

echo "Building images (this may take a few minutes)..."
docker-compose -f docker-compose.prod.full.yml build --no-cache

echo -e "${GREEN}✓ Docker images built${NC}"

# ================================================
# STEP 7: DATABASE SETUP
# ================================================
echo ""
echo -e "${YELLOW}[STEP 7/10] Setting Up Database...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

echo "Starting database containers..."
docker-compose -f docker-compose.prod.full.yml up -d postgres redis

echo "Waiting for database to be ready..."
sleep 15

echo "Running database migrations..."
docker-compose -f docker-compose.prod.full.yml run --rm backend npm run db:migrate

echo "Seeding database..."
docker-compose -f docker-compose.prod.full.yml run --rm backend npm run db:seed

echo -e "${GREEN}✓ Database setup completed${NC}"

# ================================================
# STEP 8: START ALL SERVICES
# ================================================
echo ""
echo -e "${YELLOW}[STEP 8/10] Starting Services...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

echo "Starting all containers..."
docker-compose -f docker-compose.prod.full.yml up -d

echo "Waiting for services to be ready..."
sleep 30

echo "Checking service health..."
for service in postgres redis backend nginx; do
    if docker-compose -f docker-compose.prod.full.yml ps $service | grep -q "Up"; then
        echo -e "${GREEN}✓ $service is running${NC}"
    else
        echo -e "${RED}✗ $service failed to start${NC}"
        exit 1
    fi
done

# ================================================
# STEP 9: VERIFY PRODUCTION
# ================================================
echo ""
echo -e "${YELLOW}[STEP 9/10] Verifying Production Setup...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

echo "Running production verification..."
bash $APP_DIR/scripts/verify-production.sh

echo -e "${GREEN}✓ Production verification passed${NC}"

# ================================================
# STEP 10: SETUP CRON JOBS
# ================================================
echo ""
echo -e "${YELLOW}[STEP 10/10] Setting Up Cron Jobs...${NC}"
echo -e "${BLUE}───────────────────────────────────────────────────────────${NC}"

# Daily backup at 2 AM
echo "0 2 * * * cd $APP_DIR && docker-compose -f docker-compose.prod.full.yml exec -T backend node scripts/backup.js >> ./logs/backup.log 2>&1" | crontab -

# Weekly cleanup on Sunday at 3 AM
echo "0 3 * * 0 cd $APP_DIR && bash scripts/cleanup.sh >> ./logs/cleanup.log 2>&1" | crontab -

# Monthly security hardening on 1st at 4 AM
echo "0 4 1 * * bash $APP_DIR/scripts/harden-security.sh >> ./logs/security.log 2>&1" | crontab -

echo -e "${GREEN}✓ Cron jobs configured${NC}"

# ================================================
# DEPLOYMENT COMPLETE
# ================================================
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✓ Deployment Completed Successfully!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"

echo ""
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo "   Application: Mizan AI"
echo "   Domain: https://$DOMAIN"
echo "   API Domain: https://$API_DOMAIN"
echo "   Install Dir: $APP_DIR"
echo "   App User: $APP_USER"
echo ""
echo -e "${BLUE}🔐 Access Credentials:${NC}"
echo "   Email: admin@mizan.local"
echo "   Password: admin123"
echo "   ⚠ Please change the password immediately!"
echo ""
echo -e "${BLUE}🚀 Next Steps:${NC}"
echo "   1. Verify application: https://$DOMAIN"
echo "   2. Check logs: docker-compose -f docker-compose.prod.full.yml logs -f"
echo "   3. Monitor health: https://$API_DOMAIN/health"
echo "   4. Change default password"
echo "   5. Configure email settings in .env"
echo "   6. Setup automated backups"
echo ""
echo -e "${BLUE}📝 Useful Commands:${NC}"
echo "   View logs: docker-compose -f docker-compose.prod.full.yml logs -f backend"
echo "   Restart app: docker-compose -f docker-compose.prod.full.yml restart backend"
echo "   Backup DB: docker-compose -f docker-compose.prod.full.yml exec -T backend node scripts/backup.js"
echo "   Restore DB: docker-compose -f docker-compose.prod.full.yml exec -T backend node scripts/restore.js <backup-file>"
echo "   SSH: ssh $APP_USER@localhost"
echo ""
echo -e "${YELLOW}⚠ Important Security Notes:${NC}"
echo "   • Change all default passwords"
echo "   • Update JWT_SECRET in .env"
echo "   • Configure firewall rules"
echo "   • Enable automated backups"
echo "   • Monitor logs regularly"
echo "   • Keep system packages updated"
echo ""
echo -e "${BLUE}📞 Support & Documentation:${NC}"
echo "   GitHub: https://github.com/mizanaierp-spec/Mizan-AI"
echo "   Issues: https://github.com/mizanaierp-spec/Mizan-AI/issues"
echo "   Wiki: https://github.com/mizanaierp-spec/Mizan-AI/wiki"
echo ""

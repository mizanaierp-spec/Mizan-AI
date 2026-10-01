#!/bin/bash

echo "🔒 Securing production environment..."

# Update system packages
echo ""
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y
echo "✓ System updated"

# Install security tools
echo ""
echo "🛡️  Installing security tools..."
sudo apt install -y fail2ban ufw curl
echo "✓ Security tools installed"

# Configure firewall
echo ""
echo "🔥 Configuring firewall..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw enable -y
echo "✓ Firewall configured"

# Set file permissions
echo ""
echo "🔑 Setting file permissions..."
chmod 600 .env
chmod 755 scripts/*.sh
echo "✓ Permissions set"

# Create SSH keys if needed
echo ""
echo "🔐 Checking SSH keys..."
if [ ! -f "certs/server.key" ]; then
    mkdir -p certs
    openssl req -x509 -newkey rsa:4096 -keyout certs/server.key -out certs/server.crt -days 365 -nodes
    chmod 600 certs/server.key
    echo "✓ SSL certificates generated"
else
    echo "✓ SSL certificates exist"
fi

echo ""
echo "✅ Security hardening completed!"

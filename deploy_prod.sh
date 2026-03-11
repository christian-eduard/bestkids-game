#!/bin/bash

# BestKids Production Deployment Script
# Usage: ./deploy_prod.sh

echo "🚀 Starting Manual Deployment..."

# 1. Pull latest changes
echo "📥 Pulling latest code from git..."
git pull origin main

# 2. Rebuild and restart containers
echo "🔄 Rebuilding and restarting containers..."
docker-compose -f docker-compose.prod.yml up -d --build --remove-orphans

# 3. Cleanup unused images
echo "🧹 Cleaning up old docker images..."
docker image prune -f

echo "✅ Deployment Complete!"
echo "Frontend: http://217.154.191.3:3012"
echo "Backend:  http://217.154.191.3:4012"

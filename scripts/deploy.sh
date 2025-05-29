#!/bin/bash

# Exit on error
set -e

# Load environment variables
if [ ! -f .env.production ]; then
    echo "Error: .env.production file not found!"
    exit 1
fi
source .env.production

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    exit 1
fi

# Pull latest changes
echo "Pulling latest changes..."
git pull origin main

# Create backup before deployment
echo "Creating backup before deployment..."
./scripts/backup.sh

# Build and deploy services
echo "Building and deploying services..."
docker-compose -f docker-compose.prod.yml build

# Check if this is the first deployment
if [ ! -d "./nginx/certbot/conf/live" ]; then
    echo "First deployment detected. Setting up SSL certificates..."
    ./scripts/setup-ssl.sh
fi

# Start services
echo "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Run database migrations
echo "Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T server npm run migrate

# Health check
echo "Performing health checks..."
for service in client admin server; do
    echo "Checking $service..."
    timeout 30s bash -c 'while [[ "$(curl -s -o /dev/null -w ''%{http_code}'' http://localhost:${PORT:-3000}/health)" != "200" ]]; do sleep 5; done' || {
        echo "Error: $service health check failed"
        exit 1
    }
done

echo "Deployment completed successfully!"
echo "Please check the logs for any issues:"
echo "docker-compose -f docker-compose.prod.yml logs -f" 
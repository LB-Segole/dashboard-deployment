#!/bin/bash

# Check if domain variables are set
if [ -z "$DOMAIN" ] || [ -z "$API_DOMAIN" ] || [ -z "$ADMIN_DOMAIN" ] || [ -z "$GRAFANA_DOMAIN" ] || [ -z "$SSL_EMAIL" ]; then
    echo "Error: Required environment variables are not set"
    echo "Please ensure DOMAIN, API_DOMAIN, ADMIN_DOMAIN, GRAFANA_DOMAIN, and SSL_EMAIL are set"
    exit 1
fi

# Create directories for certbot
mkdir -p ./nginx/certbot/conf
mkdir -p ./nginx/certbot/www

# Request certificates for all domains
domains=($DOMAIN $API_DOMAIN $ADMIN_DOMAIN $GRAFANA_DOMAIN)

for domain in "${domains[@]}"; do
    echo "Requesting certificate for $domain..."
    docker-compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $SSL_EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $domain
done

echo "SSL certificates have been generated successfully!"
echo "Please restart Nginx to apply the changes:"
echo "docker-compose restart nginx" 
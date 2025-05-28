#!/bin/bash
set -euo pipefail

# Maximum number of retries
MAX_RETRIES=30
RETRY_INTERVAL=2

# Function to check if a service is ready
check_service() {
    local host=$1
    local port=$2
    local service=$3
    local retries=0

    echo "Checking $service connection..."
    while ! nc -z "$host" "$port"; do
        retries=$((retries + 1))
        if [ $retries -eq $MAX_RETRIES ]; then
            echo "Error: Failed to connect to $service after $MAX_RETRIES attempts"
            exit 1
        fi
        echo "Waiting for $service... (attempt $retries/$MAX_RETRIES)"
        sleep $RETRY_INTERVAL
    done
    echo "$service is ready!"
}

# Wait for database
if [ -n "${DB_HOST:-}" ] && [ -n "${DB_PORT:-}" ]; then
    check_service "$DB_HOST" "$DB_PORT" "database"
fi

# Wait for Redis if configured
if [ -n "${REDIS_HOST:-}" ] && [ -n "${REDIS_PORT:-}" ]; then
    check_service "$REDIS_HOST" "$REDIS_PORT" "Redis"
fi

# Run database migrations if needed
if [ "${RUN_MIGRATIONS:-false}" = "true" ]; then
    echo "Running database migrations..."
    npm run db:migrate
fi

# Start the server
echo "Starting server..."
exec node dist/server.js
#!/bin/bash

# Set backup directory
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL database
echo "Backing up PostgreSQL database..."
docker-compose exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > "$BACKUP_DIR/database.sql"

# Backup Redis data
echo "Backing up Redis data..."
docker-compose exec -T redis redis-cli SAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb "$BACKUP_DIR/redis-dump.rdb"

# Backup Elasticsearch indices
echo "Backing up Elasticsearch indices..."
mkdir -p "$BACKUP_DIR/elasticsearch"
docker-compose exec -T elasticsearch elasticsearch-backup.sh "$BACKUP_DIR/elasticsearch"

# Backup SSL certificates
echo "Backing up SSL certificates..."
cp -r ./nginx/certbot/conf "$BACKUP_DIR/ssl-certificates"

# Backup Grafana data
echo "Backing up Grafana data..."
cp -r ./monitoring/grafana/provisioning "$BACKUP_DIR/grafana-config"

# Create archive
echo "Creating backup archive..."
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"
rm -rf "$BACKUP_DIR"

echo "Backup completed successfully!"
echo "Backup archive created at: $BACKUP_DIR.tar.gz"

# Optional: Upload to remote storage
if [ ! -z "$BACKUP_STORAGE_URL" ]; then
    echo "Uploading backup to remote storage..."
    curl -X PUT -T "$BACKUP_DIR.tar.gz" "$BACKUP_STORAGE_URL/$(basename $BACKUP_DIR.tar.gz)"
fi 
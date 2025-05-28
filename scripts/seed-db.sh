#!/bin/bash
set -euo pipefail

# Load utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/utils.sh"

# Required environment variables
check_env_var "DATABASE_URL"

# Optional environment variables with defaults
SEED_ENV=${SEED_ENV:-"development"}
SEED_DIR=${SEED_DIR:-"./seed"}

# Validate seed files exist
required_seed_files=(
    "agents.sql"
    "call_flows.sql"
    "test_data.sql"
)

log_info "🔍 Validating seed files..."
for file in "${required_seed_files[@]}"; do
    if [ ! -f "$SEED_DIR/$file" ]; then
        log_error "Required seed file not found: $SEED_DIR/$file"
        exit 1
    fi
done

# Check database connection
log_info "🔌 Testing database connection..."
if ! psql "$DATABASE_URL" -c '\q' > /dev/null 2>&1; then
    log_error "Could not connect to database. Please check DATABASE_URL"
    exit 1
fi

# Backup existing data if in production
if [ "$SEED_ENV" = "production" ]; then
    log_warn "⚠️ Running in PRODUCTION environment!"
    log_info "📦 Creating backup before seeding..."
    
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    if ! pg_dump "$DATABASE_URL" > "$BACKUP_FILE"; then
        log_error "Failed to create backup"
        exit 1
    fi
    log_success "Backup created: $BACKUP_FILE"
fi

# Run migrations first
log_info "🔄 Running migrations..."
retry npm run db:migrate

# Function to run seed file
run_seed_file() {
    local file=$1
    log_info "Seeding from $file..."
    if psql "$DATABASE_URL" -f "$SEED_DIR/$file"; then
        log_success "✓ Successfully seeded $file"
        return 0
    else
        log_error "Failed to seed $file"
        return 1
    fi
}

# Seed the database
log_info "🌱 Seeding database..."

# Start transaction
psql "$DATABASE_URL" << EOF
BEGIN;
-- Record seed run
CREATE TABLE IF NOT EXISTS seed_history (
    id SERIAL PRIMARY KEY,
    seed_file VARCHAR(255),
    seed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    environment VARCHAR(50),
    success BOOLEAN
);
EOF

# Run each seed file in transaction
for file in "${required_seed_files[@]}"; do
    if run_seed_file "$file"; then
        psql "$DATABASE_URL" -c "INSERT INTO seed_history (seed_file, environment, success) VALUES ('$file', '$SEED_ENV', true);"
    else
        psql "$DATABASE_URL" -c "ROLLBACK;"
        log_error "Seeding failed. Rolling back changes."
        exit 1
    fi
done

# Commit transaction
psql "$DATABASE_URL" -c "COMMIT;"

# Verify seeded data
log_info "✨ Verifying seeded data..."
verification_queries=(
    "SELECT COUNT(*) FROM agents"
    "SELECT COUNT(*) FROM call_flows"
)

for query in "${verification_queries[@]}"; do
    count=$(psql "$DATABASE_URL" -t -c "$query")
    if [ "$count" -eq 0 ]; then
        log_warn "Table appears to be empty after seeding: $query"
    else
        log_success "Verified data: $query returned $count rows"
    fi
done

log_success "✅ Database initialization complete!"

# Print summary
cat << EOF

📊 Seeding Summary:
----------------
Environment: $SEED_ENV
Seed Files:  ${#required_seed_files[@]}
Backup:      ${BACKUP_FILE:-"None"}

🔍 Verification Results:
--------------------
$(psql "$DATABASE_URL" -c "SELECT seed_file, seed_date, success FROM seed_history ORDER BY seed_date DESC LIMIT 5;")

Next steps:
1. Verify application functionality
2. Check logs for any warnings
3. Run test suite: npm test

For more information, see /docs/database.md
EOF
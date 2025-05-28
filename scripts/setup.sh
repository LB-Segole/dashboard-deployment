#!/bin/bash
set -euo pipefail

# Load utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/utils.sh"

log_info "🎛️ VoiceAI Project Setup"
log_info "======================="

# Check prerequisites
if ! command_exists node; then
    log_error "Node.js is required but not installed."
    log_info "Please install Node.js from https://nodejs.org"
    exit 1
fi

if ! command_exists npm; then
    log_error "npm is required but not installed."
    exit 1
fi

# Check Docker (optional)
if ! command_exists docker; then
    log_warn "Docker not found - some features will be limited"
    log_info "Install Docker from https://www.docker.com/get-started for full functionality"
fi

# Create environment files if they don't exist
for dir in "." "client" "server" "admin-dashboard"; do
    if [ -f "$dir/.env.example" ] && [ ! -f "$dir/.env" ]; then
        log_info "📝 Creating .env file in $dir..."
        cp "$dir/.env.example" "$dir/.env"
        log_info "ℹ️ Please edit $dir/.env with your configuration"
    fi
done

# Install dependencies with error handling
log_info "📦 Installing root dependencies..."
retry npm install

log_info "📦 Installing client dependencies..."
(cd client && retry npm install)

log_info "📦 Installing server dependencies..."
(cd server && retry npm install)

log_info "📦 Installing admin dashboard dependencies..."
(cd admin-dashboard && retry npm install)

# Setup database if Docker is available
if command_exists docker; then
    log_info "💾 Initializing database..."
    retry docker-compose -f docker/docker-compose.dev.yml up -d db
    
    # Wait for database to be ready
    wait_for_service localhost 5432 "Database"

    # Run migrations
    log_info "🔄 Running database migrations..."
    retry npm run db:migrate
else
    log_warn "Skipping database setup (Docker not available)"
fi

# Build assets
log_info "🏗️ Building frontend assets..."
retry npm run build:client
retry npm run build:admin

# Run test suite
log_info "🧪 Running test suite..."
npm run test:ci || {
    log_warn "Some tests failed - please review test output above"
}

log_success "✅ Setup complete!"

# Display final instructions
cat << EOF

🚀 Getting Started:
-----------------
1. Start development server:   npm run dev
2. Start production server:    npm start
3. Run tests:                 npm test

📝 Post-Setup Checklist:
---------------------
1. Configure environment variables in .env files:
   - Client configuration (client/.env)
   - Server configuration (server/.env)
   - Admin dashboard configuration (admin-dashboard/.env)

2. Set up required API keys for:
   - Deepgram (Speech-to-Text)
   - SignalWire (Voice calls)
   - OpenAI (AI processing)

3. Configure your database connection:
   - Check server/.env for database settings
   - Run additional migrations if needed: npm run db:migrate

4. Optional: Configure monitoring services:
   - Set up logging aggregation
   - Configure error tracking
   - Set up performance monitoring

For more information, see the documentation in /docs
EOF
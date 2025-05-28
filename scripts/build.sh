#!/bin/bash
set -euo pipefail

# Load utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/utils.sh"

# Validate environment
check_docker

# Function to clean up on exit
cleanup() {
    if [ $? -ne 0 ]; then
        log_error "Build failed! Check the logs above for details."
    fi
}
trap cleanup EXIT

# Build all Docker images
log_info "🏗️ Building VoiceAI containers..."

# Build server image
log_info "Building server image..."
retry docker-compose -f docker/docker-compose.prod.yml build --no-cache server

# Build client image
log_info "Building client image..."
retry docker-compose -f docker/docker-compose.prod.yml build --no-cache client

# Build admin dashboard image
log_info "Building admin dashboard image..."
retry docker-compose -f docker/docker-compose.prod.yml build --no-cache admin-dashboard

# Run tests in test container
log_info "🧪 Running integration tests..."
retry docker-compose -f docker/docker-compose.test.yml run --rm test

# Run security audit
log_info "🔒 Running security audit..."
retry npm audit --production || {
    log_warn "Security vulnerabilities found. Please review the audit report."
}

# Verify images
log_info "✨ Verifying built images..."
for service in server client admin-dashboard; do
    if ! docker image inspect "voiceai-$service:latest" >/dev/null 2>&1; then
        log_error "Failed to build $service image"
        exit 1
    fi
done

# Tag images for production
if [ "${CI:-false}" = "true" ]; then
    log_info "🏷️ Tagging images for production..."
    docker tag voiceai-server:latest "$DOCKER_REGISTRY/voiceai-server:$VERSION"
    docker tag voiceai-client:latest "$DOCKER_REGISTRY/voiceai-client:$VERSION"
    docker tag voiceai-admin:latest "$DOCKER_REGISTRY/voiceai-admin:$VERSION"
fi

log_success "✅ Build completed successfully!"

cat << EOF

📋 Build Summary:
--------------
- Server image:          voiceai-server:latest
- Client image:          voiceai-client:latest
- Admin Dashboard image: voiceai-admin:latest

Next steps:
1. Run locally:     docker-compose -f docker/docker-compose.prod.yml up
2. Deploy:          ./scripts/deploy-{render,netlify,cloudrun}.sh
3. Monitor:         Check logs in monitoring dashboard

For more information, see the documentation in /docs/deployment.md
EOF
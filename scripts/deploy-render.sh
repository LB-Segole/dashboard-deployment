#!/bin/bash
set -euo pipefail

# Load utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/utils.sh"

# Required environment variables
check_env_var "RENDER_API_KEY"
check_env_var "RENDER_SERVICE_ID"
check_env_var "RENDER_REGISTRY_URL"

# Optional environment variables with defaults
DEPLOY_TIMEOUT=${DEPLOY_TIMEOUT:-300}  # 5 minutes timeout
ENVIRONMENT=${ENVIRONMENT:-production}
VERSION=${VERSION:-latest}

# Validate Docker environment
check_docker

# Function to get deployment status
get_deploy_status() {
    local deploy_id=$1
    curl -sS -H "Authorization: Bearer $RENDER_API_KEY" \
        "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys/$deploy_id" \
        | jq -r '.status'
}

# Build and push Docker image
log_info "🏗️ Building Docker image..."
retry docker build -t "voiceai-render:$VERSION" -f docker/Dockerfile.prod .

log_info "📦 Tagging and pushing image..."
retry docker tag "voiceai-render:$VERSION" "$RENDER_REGISTRY_URL/$RENDER_SERVICE_ID/voiceai:$VERSION"
retry docker push "$RENDER_REGISTRY_URL/$RENDER_SERVICE_ID/voiceai:$VERSION"

# Trigger deployment
log_info "🚀 Triggering Render deployment..."
DEPLOY_RESPONSE=$(curl -sS -X POST \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"clearCache\": true}" \
    "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys")

DEPLOY_ID=$(echo "$DEPLOY_RESPONSE" | jq -r '.id')

if [ -z "$DEPLOY_ID" ] || [ "$DEPLOY_ID" = "null" ]; then
    log_error "Failed to get deployment ID from Render response"
    exit 1
fi

log_info "📡 Monitoring deployment status..."
START_TIME=$(date +%s)

while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
    
    if [ $ELAPSED_TIME -gt $DEPLOY_TIMEOUT ]; then
        log_error "Deployment timed out after $DEPLOY_TIMEOUT seconds"
        exit 1
    fi
    
    STATUS=$(get_deploy_status "$DEPLOY_ID")
    
    case $STATUS in
        "created"|"build_in_progress"|"update_in_progress")
            log_info "Deployment status: $STATUS (${ELAPSED_TIME}s elapsed)"
            sleep 10
            ;;
        "live")
            log_success "✅ Deployment completed successfully!"
            break
            ;;
        "failed"|"canceled"|"deactivated")
            log_error "Deployment failed with status: $STATUS"
            exit 1
            ;;
        *)
            log_warn "Unknown deployment status: $STATUS"
            sleep 10
            ;;
    esac
done

# Get service details
SERVICE_INFO=$(curl -sS -H "Authorization: Bearer $RENDER_API_KEY" \
    "https://api.render.com/v1/services/$RENDER_SERVICE_ID")

SERVICE_URL=$(echo "$SERVICE_INFO" | jq -r '.service.url')

cat << EOF

🎉 Deployment Summary:
-------------------
Environment: $ENVIRONMENT
Version:     $VERSION
Service URL: $SERVICE_URL

📊 Next steps:
1. Verify the deployment: curl -I $SERVICE_URL
2. Check application logs in Render dashboard
3. Monitor application metrics

For more information, see the documentation in /docs/deployment.md
EOF
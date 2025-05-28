#!/bin/bash
set -euo pipefail

# Load utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/utils.sh"

# Required environment variables
check_env_var "NETLIFY_AUTH_TOKEN"
check_env_var "NETLIFY_SITE_ID"

# Optional environment variables with defaults
DEPLOY_TIMEOUT=${DEPLOY_TIMEOUT:-300}  # 5 minutes timeout
ENVIRONMENT=${ENVIRONMENT:-production}
BUILD_DIR=${BUILD_DIR:-build}

# Function to get deployment status
get_deploy_status() {
    local deploy_id=$1
    curl -sS -H "Authorization: Bearer $NETLIFY_AUTH_TOKEN" \
        "https://api.netlify.com/api/v1/deploys/$deploy_id" \
        | jq -r '.state'
}

# Install dependencies
log_info "📦 Installing build dependencies..."
retry npm ci

# Build the project
log_info "🏗️ Building project..."
retry npm run build

# Install Netlify CLI if not present
if ! command_exists netlify; then
    log_info "🔧 Installing Netlify CLI..."
    retry npm install -g netlify-cli
fi

# Deploy to Netlify
log_info "🚀 Deploying to Netlify..."
DEPLOY_OUTPUT=$(netlify deploy \
    --prod \
    --dir="$BUILD_DIR" \
    --site="$NETLIFY_SITE_ID" \
    --auth="$NETLIFY_AUTH_TOKEN" \
    --json)

DEPLOY_ID=$(echo "$DEPLOY_OUTPUT" | jq -r '.deploy_id')
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | jq -r '.deploy_url')
SITE_URL=$(echo "$DEPLOY_OUTPUT" | jq -r '.url')

if [ -z "$DEPLOY_ID" ] || [ "$DEPLOY_ID" = "null" ]; then
    log_error "Failed to get deployment ID from Netlify"
    exit 1
fi

# Monitor deployment status
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
        "building"|"uploading"|"processing")
            log_info "Deployment status: $STATUS (${ELAPSED_TIME}s elapsed)"
            sleep 10
            ;;
        "ready")
            log_success "✅ Deployment completed successfully!"
            break
            ;;
        "error")
            log_error "Deployment failed"
            exit 1
            ;;
        *)
            log_warn "Unknown deployment status: $STATUS"
            sleep 10
            ;;
    esac
done

# Run post-deployment checks
log_info "🔍 Running post-deployment checks..."

# Check for SSL/TLS certificate
SSL_STATUS=$(curl -sS -o /dev/null -w "%{http_code}" "https://$SITE_URL")
if [ "$SSL_STATUS" = "200" ]; then
    log_success "SSL certificate is valid and active"
else
    log_warn "SSL certificate might not be ready yet"
fi

# Output deployment summary
cat << EOF

🎉 Deployment Summary:
-------------------
Environment: $ENVIRONMENT
Deploy URL:  $DEPLOY_URL
Live URL:    https://$SITE_URL

📊 Deployment Stats:
-----------------
- Build directory: $BUILD_DIR
- Deploy ID:       $DEPLOY_ID
- SSL Status:      $SSL_STATUS

📝 Next steps:
1. Verify the deployment: Visit https://$SITE_URL
2. Check Netlify dashboard for:
   - Build logs
   - Deploy previews
   - Analytics
   - Form submissions
3. Monitor site performance

🔍 Post-deployment checklist:
- [ ] Verify site loads correctly
- [ ] Check all main functionalities
- [ ] Monitor error tracking
- [ ] Review analytics
- [ ] Check form submissions (if any)

For more information, see the documentation in /docs/deployment.md
EOF

# Trigger post-deployment hooks if configured
if [ -f "scripts/post-deploy.sh" ]; then
    log_info "Running post-deployment tasks..."
    source "scripts/post-deploy.sh"
fi
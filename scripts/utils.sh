#!/bin/bash

# Color codes for better visibility
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}ℹ️ $1${NC}"
}

log_warn() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        log_error "Required environment variable $1 is not set"
        exit 1
    fi
}

# Retry mechanism for commands
retry() {
    local n=1
    local max=5
    local delay=5
    while true; do
        "$@" && break || {
            if [[ $n -lt $max ]]; then
                ((n++))
                log_warn "Command failed. Attempt $n/$max:"
                sleep $delay;
            else
                log_error "The command has failed after $n attempts."
                return 1
            fi
        }
    done
}

# Wait for service to be ready
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    local timeout=30
    local count=0

    while ! nc -z $host $port >/dev/null 2>&1; do
        if [ $count -gt $timeout ]; then
            log_error "Timed out waiting for $service_name to become ready"
            exit 1
        fi
        count=$((count + 1))
        log_info "Waiting for $service_name to become ready... ($count/$timeout)"
        sleep 1
    done
    log_success "$service_name is ready!"
}

# Get script directory
get_script_dir() {
    echo "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
}

# Validate Docker environment
check_docker() {
    if ! command_exists docker; then
        log_error "Docker is required but not installed."
        exit 1
    fi

    if ! docker info >/dev/null 2>&1; then
        log_error "Docker daemon is not running."
        exit 1
    fi
} 
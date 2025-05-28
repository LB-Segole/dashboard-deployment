#!/bin/bash
set -euo pipefail

# Load utilities
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/utils.sh"

# Required environment variables
check_env_var "TEST_API_KEY"

# Optional environment variables with defaults
API_HOST=${API_HOST:-"http://localhost:3000"}
TEST_PHONE=${TEST_PHONE:-"+15551234567"}
TIMEOUT=${TIMEOUT:-5}
TOTAL_TESTS=0
PASSED_TESTS=0

# Helper function to run a test
run_test() {
    local name=$1
    local cmd=$2
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    log_info "Running test: $name"
    if eval "$cmd"; then
        log_success "✓ Test passed: $name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        log_error "✗ Test failed: $name"
        return 1
    fi
}

# Helper function to make API requests
api_request() {
    local method=$1
    local endpoint=$2
    local data=${3:-""}
    local expected_status=${4:-200}
    
    if [ -n "$data" ]; then
        RESPONSE=$(curl -sS -X "$method" \
            -H "Authorization: Bearer $TEST_API_KEY" \
            -H "Content-Type: application/json" \
            -w "%{http_code}" \
            -d "$data" \
            "$API_HOST$endpoint")
    else
        RESPONSE=$(curl -sS -X "$method" \
            -H "Authorization: Bearer $TEST_API_KEY" \
            -w "%{http_code}" \
            "$API_HOST$endpoint")
    fi
    
    HTTP_STATUS=${RESPONSE: -3}
    RESPONSE_BODY=${RESPONSE:0:${#RESPONSE}-3}
    
    if [ "$HTTP_STATUS" = "$expected_status" ]; then
        echo "$RESPONSE_BODY"
        return 0
    else
        echo "Expected status $expected_status, got $HTTP_STATUS. Response: $RESPONSE_BODY" >&2
        return 1
    fi
}

log_info "🧪 Starting API Integration Tests"
log_info "================================"

# Test API health endpoint
run_test "Health Check" '
    HEALTH_RESPONSE=$(api_request "GET" "/health")
    echo "$HEALTH_RESPONSE" | jq -e ".status == \"ok\"" > /dev/null
'

# Test authentication
run_test "Authentication Required" '
    RESPONSE=$(curl -sS -w "%{http_code}" "$API_HOST/v1/calls")
    [ "$RESPONSE" = "401" ]
'

# Test call creation
run_test "Create Call" '
    CALL_RESPONSE=$(api_request "POST" "/v1/calls" "{\"to_number\":\"$TEST_PHONE\"}")
    CALL_ID=$(echo "$CALL_RESPONSE" | jq -r ".call_id")
    [ -n "$CALL_ID" ] && [ "$CALL_ID" != "null" ]
'

# Test retrieving call details
if [ -n "${CALL_ID:-}" ]; then
    run_test "Get Call Details" "
        DETAILS_RESPONSE=\$(api_request \"GET\" \"/v1/calls/$CALL_ID\")
        echo \"\$DETAILS_RESPONSE\" | jq -e '.id == \"$CALL_ID\"' > /dev/null
    "
fi

# Test agents endpoint
run_test "List Agents" '
    AGENTS_RESPONSE=$(api_request "GET" "/v1/agents")
    echo "$AGENTS_RESPONSE" | jq -e ". | type == \"array\"" > /dev/null
'

# Test analytics endpoint
run_test "Get Analytics" '
    ANALYTICS_RESPONSE=$(api_request "GET" "/v1/analytics/summary")
    echo "$ANALYTICS_RESPONSE" | jq -e ".total_calls != null" > /dev/null
'

# Calculate success rate
SUCCESS_RATE=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))

# Print test summary
cat << EOF

📊 Test Summary:
-------------
Total Tests:  $TOTAL_TESTS
Passed:       $PASSED_TESTS
Failed:       $(( TOTAL_TESTS - PASSED_TESTS ))
Success Rate: $SUCCESS_RATE%

🌐 Test Environment:
-----------------
API Host:     $API_HOST
Test Number:  $TEST_PHONE
Timeout:      ${TIMEOUT}s

$(if [ $SUCCESS_RATE -eq 100 ]; then
    log_success "✅ All tests passed successfully!"
else
    log_error "❌ Some tests failed - check logs above for details"
fi)

For detailed API documentation, see /docs/api-reference.md
EOF

# Exit with failure if any tests failed
[ $SUCCESS_RATE -eq 100 ] || exit 1
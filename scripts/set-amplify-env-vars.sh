#!/bin/bash

# Script to set environment variables for Amplify deployment
# Usage: ./scripts/set-amplify-env-vars.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting Amplify Environment Variables${NC}"

# Your specific values
APP_ID=${AMPLIFY_APP_ID:-"your-app-id"}
BRANCH_NAME=${AMPLIFY_BRANCH:-"main"}

# Cognito values based on your user pool
USER_POOL_ID="us-east-1_TBQtRz0K6"
USER_POOL_CLIENT_ID=${COGNITO_CLIENT_ID:-"your-client-id"}
IDENTITY_POOL_ID=${COGNITO_IDENTITY_POOL_ID:-""}
AWS_REGION="us-east-1"
API_ENDPOINT=${API_GATEWAY_URL:-"https://your-api-gateway.execute-api.us-east-1.amazonaws.com"}

echo -e "${YELLOW}Using the following values:${NC}"
echo "  App ID: $APP_ID"
echo "  Branch: $BRANCH_NAME"
echo "  User Pool ID: $USER_POOL_ID"
echo "  Region: $AWS_REGION"

# Function to set an environment variable
set_env_var() {
    local key=$1
    local value=$2
    
    echo -e "${YELLOW}Setting $key...${NC}"
    
    aws amplify update-app \
        --app-id "$APP_ID" \
        --environment-variables "$key=$value" \
        2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Set $key${NC}"
    else
        # If update-app fails, try update-branch
        aws amplify update-branch \
            --app-id "$APP_ID" \
            --branch-name "$BRANCH_NAME" \
            --environment-variables "$key=$value" \
            2>/dev/null
            
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ Set $key for branch $BRANCH_NAME${NC}"
        else
            echo -e "${RED}✗ Failed to set $key${NC}"
        fi
    fi
}

# Set each environment variable
set_env_var "VITE_COGNITO_USER_POOL_ID" "$USER_POOL_ID"
set_env_var "VITE_COGNITO_CLIENT_ID" "$USER_POOL_CLIENT_ID"
set_env_var "VITE_COGNITO_IDENTITY_POOL_ID" "$IDENTITY_POOL_ID"
set_env_var "VITE_AWS_REGION" "$AWS_REGION"
set_env_var "VITE_API_BASE_URL" "$API_ENDPOINT"
set_env_var "VITE_API_GATEWAY_URL" "$API_ENDPOINT"

echo -e "${GREEN}Environment variable setup complete!${NC}"
echo -e "${YELLOW}Note: You may need to trigger a new build for changes to take effect.${NC}"

# Optionally trigger a new build
read -p "Would you like to trigger a new build? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Triggering new build...${NC}"
    aws amplify start-job \
        --app-id "$APP_ID" \
        --branch-name "$BRANCH_NAME" \
        --job-type RELEASE
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Build triggered successfully${NC}"
    else
        echo -e "${RED}✗ Failed to trigger build${NC}"
    fi
fi
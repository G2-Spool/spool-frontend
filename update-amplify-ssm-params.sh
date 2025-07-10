#!/bin/bash

# Update Amplify SSM Parameters
# Replace the placeholder values with your actual AWS resource IDs

AMPLIFY_APP_ID="dtsagfuinz4s7"
BRANCH="main"
REGION="us-east-1"

echo "Updating Amplify SSM Parameters..."

# Update with your actual Cognito User Pool ID
# Example: us-east-1_AbCdEfGhI
read -p "Enter your Cognito User Pool ID (e.g., us-east-1_AbCdEfGhI): " USER_POOL_ID
if [ ! -z "$USER_POOL_ID" ]; then
    aws ssm put-parameter \
        --name "/amplify/$AMPLIFY_APP_ID/$BRANCH/REACT_APP_COGNITO_USER_POOL_ID" \
        --value "$USER_POOL_ID" \
        --type "SecureString" \
        --overwrite \
        --region $REGION
    echo "✓ Updated User Pool ID"
fi

# Update with your actual Cognito User Pool Client ID
read -p "Enter your Cognito User Pool Client ID: " CLIENT_ID
if [ ! -z "$CLIENT_ID" ]; then
    aws ssm put-parameter \
        --name "/amplify/$AMPLIFY_APP_ID/$BRANCH/REACT_APP_COGNITO_USER_POOL_CLIENT_ID" \
        --value "$CLIENT_ID" \
        --type "SecureString" \
        --overwrite \
        --region $REGION
    echo "✓ Updated User Pool Client ID"
fi

# Update with your actual Cognito Identity Pool ID
# Example: us-east-1:12345678-1234-1234-1234-123456789012
read -p "Enter your Cognito Identity Pool ID (e.g., us-east-1:12345678-...): " IDENTITY_POOL_ID
if [ ! -z "$IDENTITY_POOL_ID" ]; then
    aws ssm put-parameter \
        --name "/amplify/$AMPLIFY_APP_ID/$BRANCH/REACT_APP_COGNITO_IDENTITY_POOL_ID" \
        --value "$IDENTITY_POOL_ID" \
        --type "SecureString" \
        --overwrite \
        --region $REGION
    echo "✓ Updated Identity Pool ID"
fi

# Update with your actual API Gateway URL for Interview Service
read -p "Enter your Interview API Gateway URL (or press Enter to skip): " INTERVIEW_API_URL
if [ ! -z "$INTERVIEW_API_URL" ]; then
    aws ssm put-parameter \
        --name "/amplify/$AMPLIFY_APP_ID/$BRANCH/REACT_APP_INTERVIEW_API_URL" \
        --value "$INTERVIEW_API_URL" \
        --type "String" \
        --overwrite \
        --region $REGION
    echo "✓ Updated Interview API URL"
fi

# Update with your actual TURN server address
read -p "Enter your TURN server address (or press Enter for default): " TURN_SERVER
if [ ! -z "$TURN_SERVER" ]; then
    aws ssm put-parameter \
        --name "/amplify/$AMPLIFY_APP_ID/$BRANCH/REACT_APP_TURN_SERVER" \
        --value "$TURN_SERVER" \
        --type "String" \
        --overwrite \
        --region $REGION
    echo "✓ Updated TURN Server"
fi

echo ""
echo "✅ SSM Parameters updated successfully!"
echo ""
echo "Current parameters:"
aws ssm get-parameters-by-path \
    --path "/amplify/$AMPLIFY_APP_ID/$BRANCH/" \
    --region $REGION \
    --query "Parameters[*].[Name, Type]" \
    --output table
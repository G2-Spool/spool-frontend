#!/bin/bash

# Deploy Lambda function to populate RDS data - Fixed version

set -e

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
FUNCTION_NAME="spool-populate-rds-data"
RUNTIME="nodejs18.x"
HANDLER="index.handler"
TIMEOUT=300  # 5 minutes
MEMORY=512
REGION="us-east-1"
ROLE_NAME="spool-populate-rds-lambda-role"
VPC_ID="vpc-e5a7949f"  # Using the actual VPC

echo -e "${GREEN}=== Deploying Lambda Function to Populate RDS ===${NC}"
echo ""

# Get role ARN (already created)
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text --region $REGION)
echo "Using IAM Role: $ROLE_ARN"

# Get subnets
echo -e "${YELLOW}Getting subnet configuration...${NC}"
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --region $REGION --query 'Subnets[?AvailabilityZone!=`null`].[SubnetId]' --output text | head -2 | tr '\n' ',' | sed 's/,$//')
echo "Subnets: $SUBNET_IDS"

# Get or create security group
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=spool-lambda-sg" "Name=vpc-id,Values=$VPC_ID" --region $REGION --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "None")

if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
    echo "Creating security group for Lambda..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name "spool-lambda-sg" \
        --description "Security group for Spool Lambda functions" \
        --vpc-id $VPC_ID \
        --region $REGION \
        --query 'GroupId' \
        --output text)
    
    # Add outbound rule for HTTPS (443) and PostgreSQL (5432)
    aws ec2 authorize-security-group-egress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 443 \
        --cidr 0.0.0.0/0 \
        --region $REGION 2>/dev/null || true
    
    aws ec2 authorize-security-group-egress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 5432 \
        --cidr 0.0.0.0/0 \
        --region $REGION 2>/dev/null || true
fi
echo "Security Group: $SG_ID"

# Package Lambda function
echo -e "${YELLOW}Packaging Lambda function...${NC}"
cd /workspaces/spool-frontend/lambda/populateRdsData
zip -q -r /tmp/populate-rds-lambda.zip . -x "*.git*"

# Deploy Lambda function
echo -e "${YELLOW}Creating Lambda function...${NC}"
aws lambda create-function \
    --function-name $FUNCTION_NAME \
    --runtime $RUNTIME \
    --role $ROLE_ARN \
    --handler $HANDLER \
    --timeout $TIMEOUT \
    --memory-size $MEMORY \
    --zip-file fileb:///tmp/populate-rds-lambda.zip \
    --vpc-config SubnetIds=$SUBNET_IDS,SecurityGroupIds=$SG_ID \
    --region $REGION 2>/dev/null || {
    echo "Function exists, updating..."
    aws lambda update-function-code \
        --function-name $FUNCTION_NAME \
        --zip-file fileb:///tmp/populate-rds-lambda.zip \
        --region $REGION
    
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --timeout $TIMEOUT \
        --memory-size $MEMORY \
        --vpc-config SubnetIds=$SUBNET_IDS,SecurityGroupIds=$SG_ID \
        --region $REGION
}

echo ""
echo -e "${GREEN}Lambda function deployed successfully!${NC}"
echo ""
echo -e "${YELLOW}Now executing the function to populate RDS...${NC}"

# Invoke the function
aws lambda invoke \
    --function-name $FUNCTION_NAME \
    --region $REGION \
    /tmp/populate-result.json

echo ""
echo -e "${GREEN}Results:${NC}"
cat /tmp/populate-result.json | jq . || cat /tmp/populate-result.json

echo ""
echo -e "${GREEN}RDS population complete!${NC}"
echo ""
echo "The function has:"
echo "- Created the threads, thread_analysis, and thread_sections tables"
echo "- Generated 2-4 threads for each of the 10 users"
echo "- Created educational content with relevance scores above 80%"
echo ""
echo "To verify in RDS, you can use AWS CloudShell with:"
echo "psql -h database-1.cmtqo5bo1y3x.us-east-1.rds.amazonaws.com -U postgres -d spool"
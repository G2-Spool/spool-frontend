#!/bin/bash

# Deploy Lambda function to populate RDS data

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

echo -e "${GREEN}=== Deploying Lambda Function to Populate RDS ===${NC}"
echo ""

# Step 1: Check if Lambda function already exists
echo -e "${YELLOW}Checking if Lambda function exists...${NC}"
EXISTING_FUNCTION=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION 2>&1 || echo "NotFound")

if [[ "$EXISTING_FUNCTION" == *"NotFound"* ]]; then
    echo "Lambda function does not exist. Creating..."
    
    # Step 2: Create IAM role for Lambda
    echo -e "${YELLOW}Creating IAM role...${NC}"
    
    # Create trust policy
    cat > /tmp/trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
    
    # Create role
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file:///tmp/trust-policy.json \
        --region $REGION 2>/dev/null || echo "Role may already exist"
    
    # Attach policies
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
        --region $REGION 2>/dev/null || true
    
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess \
        --region $REGION 2>/dev/null || true
    
    # Create inline policy for VPC access
    cat > /tmp/vpc-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ec2:CreateNetworkInterface",
                "ec2:DescribeNetworkInterfaces",
                "ec2:DeleteNetworkInterface",
                "ec2:AssignPrivateIpAddresses",
                "ec2:UnassignPrivateIpAddresses"
            ],
            "Resource": "*"
        }
    ]
}
EOF
    
    aws iam put-role-policy \
        --role-name $ROLE_NAME \
        --policy-name VPCAccessPolicy \
        --policy-document file:///tmp/vpc-policy.json \
        --region $REGION 2>/dev/null || true
    
    # Wait for role to be ready
    echo "Waiting for IAM role to be ready..."
    sleep 10
    
    # Get role ARN
    ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text --region $REGION)
else
    echo "Lambda function already exists. Will update it."
    ROLE_ARN=$(aws lambda get-function --function-name $FUNCTION_NAME --region $REGION --query 'Configuration.Role' --output text)
fi

# Step 3: Package Lambda function
echo -e "${YELLOW}Packaging Lambda function...${NC}"
cd /workspaces/spool-frontend/lambda/populateRdsData
npm install
zip -r /tmp/populate-rds-lambda.zip .

# Step 4: Get VPC configuration
echo -e "${YELLOW}Getting VPC configuration...${NC}"
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=*spool*" --region $REGION --query 'Vpcs[0].VpcId' --output text 2>/dev/null || echo "")

if [ -z "$VPC_ID" ]; then
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --region $REGION --query 'Vpcs[0].VpcId' --output text)
fi

# Get subnets
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --region $REGION --query 'Subnets[?AvailabilityZone!=`null`].[SubnetId]' --output text | tr '\n' ',' | sed 's/,$//')

# Get or create security group
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=spool-lambda-sg" --region $REGION --query 'SecurityGroups[0].GroupId' --output text 2>/dev/null || echo "")

if [ -z "$SG_ID" ] || [ "$SG_ID" == "None" ]; then
    echo "Creating security group for Lambda..."
    SG_ID=$(aws ec2 create-security-group \
        --group-name "spool-lambda-sg" \
        --description "Security group for Spool Lambda functions" \
        --vpc-id $VPC_ID \
        --region $REGION \
        --query 'GroupId' \
        --output text)
fi

# Step 5: Deploy or update Lambda function
if [[ "$EXISTING_FUNCTION" == *"NotFound"* ]]; then
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
        --region $REGION
else
    echo -e "${YELLOW}Updating Lambda function...${NC}"
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
fi

# Step 6: Invoke the function
echo ""
echo -e "${GREEN}Lambda function deployed successfully!${NC}"
echo ""
echo -e "${YELLOW}To populate the RDS database, run:${NC}"
echo -e "${BLUE}aws lambda invoke \\
    --function-name $FUNCTION_NAME \\
    --region $REGION \\
    /tmp/populate-result.json${NC}"
echo ""
echo "Then check the results with:"
echo -e "${BLUE}cat /tmp/populate-result.json | jq .${NC}"
echo ""
echo -e "${GREEN}The function will:${NC}"
echo "- Create the necessary tables in RDS"
echo "- Generate 2-4 threads for each of the 10 users"
echo "- Create thread analysis and sections for each thread"
echo "- Return a summary of the data created"
#!/bin/bash

# Spool RDS Deployment and Data Population Script
# This script deploys an RDS PostgreSQL instance and populates it with thread data

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
DB_INSTANCE_ID="spool-prod-db"
DB_NAME="spool"
DB_USERNAME="spooladmin"
DB_INSTANCE_CLASS="db.t3.micro"
ACCOUNT_ID="560281064968"

echo -e "${GREEN}=== Spool RDS Deployment and Data Population ===${NC}"
echo ""

# Check AWS CLI configuration
echo -e "${YELLOW}Checking AWS CLI configuration...${NC}"
aws sts get-caller-identity --region $AWS_REGION || {
    echo -e "${RED}Error: AWS CLI not configured properly${NC}"
    exit 1
}

# Function to generate secure password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Step 1: Check if RDS instance already exists
echo -e "${YELLOW}Checking if RDS instance already exists...${NC}"
EXISTING_DB=$(aws rds describe-db-instances \
    --db-instance-identifier $DB_INSTANCE_ID \
    --region $AWS_REGION \
    --query 'DBInstances[0].DBInstanceIdentifier' \
    --output text 2>/dev/null || echo "None")

if [ "$EXISTING_DB" != "None" ]; then
    echo -e "${GREEN}RDS instance $DB_INSTANCE_ID already exists${NC}"
    RDS_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier $DB_INSTANCE_ID \
        --region $AWS_REGION \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)
    echo "Endpoint: $RDS_ENDPOINT"
    
    # Get password from SSM
    DB_PASSWORD=$(aws ssm get-parameter \
        --name "/spool/prod/rds/password" \
        --with-decryption \
        --region $AWS_REGION \
        --query 'Parameter.Value' \
        --output text 2>/dev/null || echo "")
    
    if [ -z "$DB_PASSWORD" ]; then
        echo -e "${RED}Error: Could not retrieve database password from SSM${NC}"
        exit 1
    fi
else
    # Generate secure password
    DB_PASSWORD=$(generate_password)
    echo -e "${YELLOW}Generated secure password for RDS instance${NC}"
    
    # Get VPC and subnet information
    echo -e "${YELLOW}Getting VPC and subnet information...${NC}"
    VPC_ID=$(aws ec2 describe-vpcs \
        --filters "Name=tag:Name,Values=*spool*" \
        --region $AWS_REGION \
        --query 'Vpcs[0].VpcId' \
        --output text 2>/dev/null || echo "")
    
    if [ -z "$VPC_ID" ]; then
        echo -e "${YELLOW}No Spool VPC found. Using default VPC...${NC}"
        VPC_ID=$(aws ec2 describe-vpcs \
            --filters "Name=is-default,Values=true" \
            --region $AWS_REGION \
            --query 'Vpcs[0].VpcId' \
            --output text)
    fi
    
    # Create security group for RDS
    echo -e "${YELLOW}Creating security group for RDS...${NC}"
    SG_ID=$(aws ec2 create-security-group \
        --group-name "spool-rds-sg" \
        --description "Security group for Spool RDS instance" \
        --vpc-id $VPC_ID \
        --region $AWS_REGION \
        --query 'GroupId' \
        --output text 2>/dev/null || \
        aws ec2 describe-security-groups \
            --filters "Name=group-name,Values=spool-rds-sg" \
            --region $AWS_REGION \
            --query 'SecurityGroups[0].GroupId' \
            --output text)
    
    # Add ingress rules
    aws ec2 authorize-security-group-ingress \
        --group-id $SG_ID \
        --protocol tcp \
        --port 5432 \
        --source-group $SG_ID \
        --region $AWS_REGION 2>/dev/null || true
    
    # Create DB subnet group
    echo -e "${YELLOW}Creating DB subnet group...${NC}"
    SUBNET_IDS=$(aws ec2 describe-subnets \
        --filters "Name=vpc-id,Values=$VPC_ID" \
        --region $AWS_REGION \
        --query 'Subnets[?AvailabilityZone!=`null`].SubnetId' \
        --output text | tr '\t' ' ')
    
    aws rds create-db-subnet-group \
        --db-subnet-group-name "spool-db-subnet-group" \
        --db-subnet-group-description "Subnet group for Spool RDS" \
        --subnet-ids $SUBNET_IDS \
        --region $AWS_REGION 2>/dev/null || true
    
    # Create RDS instance
    echo -e "${YELLOW}Creating RDS PostgreSQL instance...${NC}"
    aws rds create-db-instance \
        --db-instance-identifier $DB_INSTANCE_ID \
        --db-instance-class $DB_INSTANCE_CLASS \
        --engine postgres \
        --engine-version 15.3 \
        --allocated-storage 20 \
        --storage-type gp3 \
        --master-username $DB_USERNAME \
        --master-user-password "$DB_PASSWORD" \
        --vpc-security-group-ids $SG_ID \
        --db-subnet-group-name "spool-db-subnet-group" \
        --backup-retention-period 7 \
        --multi-az \
        --storage-encrypted \
        --tags Key=Environment,Value=prod Key=Project,Value=spool \
        --region $AWS_REGION
    
    echo -e "${YELLOW}Waiting for RDS instance to be available (this may take 5-10 minutes)...${NC}"
    aws rds wait db-instance-available \
        --db-instance-identifier $DB_INSTANCE_ID \
        --region $AWS_REGION
    
    # Get endpoint
    RDS_ENDPOINT=$(aws rds describe-db-instances \
        --db-instance-identifier $DB_INSTANCE_ID \
        --region $AWS_REGION \
        --query 'DBInstances[0].Endpoint.Address' \
        --output text)
    
    echo -e "${GREEN}RDS instance created successfully!${NC}"
    echo "Endpoint: $RDS_ENDPOINT"
    
    # Store connection details in SSM Parameter Store
    echo -e "${YELLOW}Storing connection details in SSM Parameter Store...${NC}"
    aws ssm put-parameter \
        --name "/spool/prod/rds/host" \
        --value "$RDS_ENDPOINT" \
        --type "String" \
        --overwrite \
        --region $AWS_REGION
    
    aws ssm put-parameter \
        --name "/spool/prod/rds/port" \
        --value "5432" \
        --type "String" \
        --overwrite \
        --region $AWS_REGION
    
    aws ssm put-parameter \
        --name "/spool/prod/rds/database" \
        --value "$DB_NAME" \
        --type "String" \
        --overwrite \
        --region $AWS_REGION
    
    aws ssm put-parameter \
        --name "/spool/prod/rds/username" \
        --value "$DB_USERNAME" \
        --type "String" \
        --overwrite \
        --region $AWS_REGION
    
    aws ssm put-parameter \
        --name "/spool/prod/rds/password" \
        --value "$DB_PASSWORD" \
        --type "SecureString" \
        --overwrite \
        --region $AWS_REGION
fi

# Step 2: Create database and tables
echo -e "${YELLOW}Creating database and tables...${NC}"

# Create the database first
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -U "$DB_USERNAME" \
    -d postgres \
    -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database may already exist"

# Create tables
echo -e "${YELLOW}Creating tables...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -U "$DB_USERNAME" \
    -d "$DB_NAME" \
    -f /workspaces/spool-frontend/sql/create-thread-tables.sql

# Step 3: Generate mock data
echo -e "${YELLOW}Generating mock thread data...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -U "$DB_USERNAME" \
    -d "$DB_NAME" \
    -f /workspaces/spool-frontend/sql/generate-thread-data.sql

# Step 4: Verify data
echo -e "${YELLOW}Verifying data...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -U "$DB_USERNAME" \
    -d "$DB_NAME" \
    -f /workspaces/spool-frontend/sql/verify-thread-data.sql

# Step 5: Update Lambda environment variables
echo -e "${YELLOW}Updating Lambda function configuration...${NC}"
DATABASE_URL="postgresql://$DB_USERNAME:$DB_PASSWORD@$RDS_ENDPOINT:5432/$DB_NAME"

aws lambda update-function-configuration \
    --function-name spool-create-thread \
    --environment "Variables={DATABASE_URL=$DATABASE_URL}" \
    --region $AWS_REGION 2>/dev/null || \
    echo -e "${YELLOW}Note: Lambda function 'spool-create-thread' not found. Please update manually when created.${NC}"

# Step 6: Test database connection
echo -e "${YELLOW}Testing database connection...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -U "$DB_USERNAME" \
    -d "$DB_NAME" \
    -c "SELECT COUNT(*) as thread_count FROM threads;" || {
        echo -e "${RED}Error: Could not connect to database${NC}"
        exit 1
    }

echo ""
echo -e "${GREEN}=== Deployment Complete ===${NC}"
echo ""
echo "RDS Instance: $DB_INSTANCE_ID"
echo "Endpoint: $RDS_ENDPOINT"
echo "Database: $DB_NAME"
echo "Username: $DB_USERNAME"
echo ""
echo "Connection string for local testing:"
echo "export DATABASE_URL=\"postgresql://$DB_USERNAME:[PASSWORD]@$RDS_ENDPOINT:5432/$DB_NAME\""
echo ""
echo "SSM Parameters created:"
echo "  /spool/prod/rds/host"
echo "  /spool/prod/rds/port"
echo "  /spool/prod/rds/database"
echo "  /spool/prod/rds/username"
echo "  /spool/prod/rds/password (SecureString)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Update Lambda functions with DATABASE_URL environment variable"
echo "2. Test API Gateway endpoints to ensure data flows correctly"
echo "3. Verify the /threads page displays the generated data"
echo ""
echo -e "${GREEN}Thread data has been successfully generated for all Cognito users!${NC}"
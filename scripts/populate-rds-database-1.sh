#!/bin/bash

# Script to populate the existing database-1 RDS instance with thread data

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="us-east-1"
RDS_ENDPOINT="database-1.cmtqo5bo1y3x.us-east-1.rds.amazonaws.com"
RDS_PORT="5432"
DB_NAME="spool"
DB_USERNAME="postgres"

echo -e "${GREEN}=== Populating RDS database-1 with Thread Data ===${NC}"
echo ""
echo "RDS Endpoint: $RDS_ENDPOINT"
echo "Database: $DB_NAME"
echo "Username: $DB_USERNAME"
echo ""

# Get the password from SSM Parameter Store or prompt
echo -e "${YELLOW}Retrieving database password...${NC}"
DB_PASSWORD=$(aws ssm get-parameter \
    --name "/spool/prod/rds/password" \
    --with-decryption \
    --region $AWS_REGION \
    --query 'Parameter.Value' \
    --output text 2>/dev/null || echo "")

if [ -z "$DB_PASSWORD" ]; then
    echo -e "${YELLOW}Password not found in SSM Parameter Store.${NC}"
    echo -n "Please enter the database password for $DB_USERNAME: "
    read -s DB_PASSWORD
    echo ""
fi

# Step 1: Create the spool database if it doesn't exist
echo -e "${YELLOW}Creating spool database if it doesn't exist...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -p "$RDS_PORT" \
    -U "$DB_USERNAME" \
    -d postgres \
    -c "SELECT 1 FROM pg_database WHERE datname = 'spool'" | grep -q 1 || \
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -p "$RDS_PORT" \
    -U "$DB_USERNAME" \
    -d postgres \
    -c "CREATE DATABASE spool;"

echo -e "${GREEN}Database 'spool' is ready${NC}"

# Step 2: Create tables
echo -e "${YELLOW}Creating thread tables...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -p "$RDS_PORT" \
    -U "$DB_USERNAME" \
    -d "$DB_NAME" \
    -f /workspaces/spool-frontend/sql/create-thread-tables.sql

echo -e "${GREEN}Tables created successfully${NC}"

# Step 3: Generate mock data for all 10 users
echo -e "${YELLOW}Generating thread data for all 10 users...${NC}"
echo "This will create 2-5 threads per user with realistic educational content"
echo ""

PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -p "$RDS_PORT" \
    -U "$DB_USERNAME" \
    -d "$DB_NAME" \
    -f /workspaces/spool-frontend/sql/generate-thread-data-all-users.sql

# Step 4: Verify the data
echo ""
echo -e "${YELLOW}Verifying generated data...${NC}"
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$RDS_ENDPOINT" \
    -p "$RDS_PORT" \
    -U "$DB_USERNAME" \
    -d "$DB_NAME" \
    -f /workspaces/spool-frontend/sql/verify-thread-data.sql

# Step 5: Store connection info in SSM if not already there
if [ -z "$(aws ssm get-parameter --name "/spool/prod/rds/password" --region $AWS_REGION 2>/dev/null)" ]; then
    echo -e "${YELLOW}Storing connection details in SSM Parameter Store...${NC}"
    
    aws ssm put-parameter \
        --name "/spool/prod/rds/host" \
        --value "$RDS_ENDPOINT" \
        --type "String" \
        --overwrite \
        --region $AWS_REGION
    
    aws ssm put-parameter \
        --name "/spool/prod/rds/port" \
        --value "$RDS_PORT" \
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
    
    echo -e "${GREEN}SSM parameters updated${NC}"
fi

# Step 6: Update Lambda environment variable (if Lambda exists)
echo -e "${YELLOW}Checking for Lambda function to update...${NC}"
DATABASE_URL="postgresql://$DB_USERNAME:$DB_PASSWORD@$RDS_ENDPOINT:$RDS_PORT/$DB_NAME"

aws lambda get-function --function-name spool-create-thread --region $AWS_REGION &>/dev/null && {
    echo -e "${YELLOW}Updating Lambda function environment...${NC}"
    aws lambda update-function-configuration \
        --function-name spool-create-thread \
        --environment "Variables={DATABASE_URL=$DATABASE_URL}" \
        --region $AWS_REGION &>/dev/null
    echo -e "${GREEN}Lambda function updated${NC}"
} || {
    echo -e "${YELLOW}Lambda function 'spool-create-thread' not found. Skipping update.${NC}"
}

# Summary
echo ""
echo -e "${GREEN}=== Population Complete ===${NC}"
echo ""
echo "Database populated with thread data for 10 users:"
echo "- 2spool4school@gmail.com"
echo "- shpoolbot@spool.com"
echo "- dslunde@gmail.com"
echo "- ahmadirad174@gmail.com"
echo "- test@spool.com"
echo "- getthatthread@gmail.com"
echo "- yarnoflife@gmail.com"
echo "- sean@gmail.com"
echo "- hutchenbach@gmail.com"
echo "- dummy@gmail.com"
echo ""
echo "Each user has 2-5 learning threads with:"
echo "- Diverse educational topics"
echo "- AI-generated analysis (subjects, topics, concepts)"
echo "- 3-5 content sections per thread"
echo "- Relevance scores above 80%"
echo "- Estimated reading times"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test the /threads page to see the generated data"
echo "2. Verify API Gateway can retrieve the data"
echo "3. Check that each user sees their personalized threads"
echo ""
echo "Connection string for testing:"
echo "postgresql://$DB_USERNAME:[PASSWORD]@$RDS_ENDPOINT:$RDS_PORT/$DB_NAME"
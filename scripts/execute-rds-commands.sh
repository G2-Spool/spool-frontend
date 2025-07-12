#!/bin/bash

# Script to execute SQL commands on RDS using AWS CloudShell approach

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
RDS_ENDPOINT="database-1.cmtqo5bo1y3x.us-east-1.rds.amazonaws.com"
RDS_PORT="5432"
DB_NAME="spool"
DB_USERNAME="postgres"
DB_PASSWORD="spoolrds"

echo -e "${GREEN}=== RDS Thread Data Population Instructions ===${NC}"
echo ""
echo -e "${BLUE}Database Details:${NC}"
echo "  Endpoint: $RDS_ENDPOINT"
echo "  Port: $RDS_PORT"
echo "  Database: $DB_NAME"
echo "  Username: $DB_USERNAME"
echo ""

echo -e "${YELLOW}Since psql is not available in this environment, follow these steps:${NC}"
echo ""

echo -e "${GREEN}Option 1: Use AWS CloudShell (Recommended)${NC}"
echo "1. Open AWS CloudShell in your AWS Console"
echo "2. Run these commands in CloudShell:"
echo ""
echo -e "${BLUE}# Install PostgreSQL client${NC}"
echo "sudo yum install -y postgresql15"
echo ""
echo -e "${BLUE}# Create the SQL files${NC}"
echo "cat > create-tables.sql << 'EOF'"
cat /workspaces/spool-frontend/sql/create-thread-tables.sql
echo "EOF"
echo ""
echo "cat > generate-data.sql << 'EOF'"
cat /workspaces/spool-frontend/sql/generate-thread-data-all-users.sql
echo "EOF"
echo ""
echo -e "${BLUE}# Create database if not exists${NC}"
echo "PGPASSWORD='$DB_PASSWORD' psql -h $RDS_ENDPOINT -U $DB_USERNAME -d postgres -c \"CREATE DATABASE $DB_NAME;\" || echo 'Database may already exist'"
echo ""
echo -e "${BLUE}# Create tables${NC}"
echo "PGPASSWORD='$DB_PASSWORD' psql -h $RDS_ENDPOINT -U $DB_USERNAME -d $DB_NAME -f create-tables.sql"
echo ""
echo -e "${BLUE}# Generate thread data${NC}"
echo "PGPASSWORD='$DB_PASSWORD' psql -h $RDS_ENDPOINT -U $DB_USERNAME -d $DB_NAME -f generate-data.sql"
echo ""
echo -e "${BLUE}# Verify the data${NC}"
echo "PGPASSWORD='$DB_PASSWORD' psql -h $RDS_ENDPOINT -U $DB_USERNAME -d $DB_NAME -c \"SELECT student_id, COUNT(*) as thread_count FROM threads GROUP BY student_id ORDER BY thread_count DESC;\""
echo ""

echo -e "${GREEN}Option 2: Create a Lambda Function${NC}"
echo "Create a Lambda function with the following:"
echo "1. Runtime: Python 3.9+"
echo "2. Add psycopg2 layer or include it in deployment package"
echo "3. Set environment variable: DATABASE_URL=postgresql://$DB_USERNAME:$DB_PASSWORD@$RDS_ENDPOINT:$RDS_PORT/$DB_NAME"
echo "4. Use the generated SQL files to populate the database"
echo ""

echo -e "${GREEN}Option 3: Use an EC2 Instance${NC}"
echo "1. Launch an EC2 instance in the same VPC as your RDS"
echo "2. SSH into the instance"
echo "3. Install PostgreSQL client: sudo yum install -y postgresql15"
echo "4. Copy the SQL files and run the commands above"
echo ""

echo -e "${YELLOW}Files created:${NC}"
echo "  - /workspaces/spool-frontend/sql/create-thread-tables.sql"
echo "  - /workspaces/spool-frontend/sql/generate-thread-data-all-users.sql"
echo "  - /workspaces/spool-frontend/sql/populate-threads-auto-generated.sql"
echo ""

echo -e "${GREEN}Expected Results:${NC}"
echo "  - 10 users with thread data"
echo "  - 2-5 threads per user (approximately 25-35 total threads)"
echo "  - Each thread has 3-5 content sections"
echo "  - All relevance scores above 80%"
echo "  - Diverse educational topics across STEM and liberal arts"
echo ""

echo -e "${BLUE}Quick Test Query:${NC}"
echo "After running the scripts, test with:"
echo "PGPASSWORD='$DB_PASSWORD' psql -h $RDS_ENDPOINT -U $DB_USERNAME -d $DB_NAME -c \"SELECT t.title, ta.subjects, ta.summary FROM threads t JOIN thread_analysis ta ON t.id = ta.thread_id LIMIT 3;\""
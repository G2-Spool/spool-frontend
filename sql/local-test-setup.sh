#!/bin/bash

# Local PostgreSQL setup script for testing thread data generation
# This script sets up a local PostgreSQL instance for testing before deploying to RDS

echo "=== Spool Thread Data Local Test Setup ==="
echo "This script helps you test the thread data generation locally before deploying to AWS RDS"
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "On macOS: brew install postgresql"
    exit 1
fi

# Set database parameters
DB_NAME="spool_test"
DB_USER="spool_admin"
DB_PASS="spool_test_123"

echo "1. Creating local test database..."
sudo -u postgres psql <<EOF
-- Create user if not exists
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_user WHERE usename = '$DB_USER') THEN
        CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';
    END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo ""
echo "2. Creating tables..."
PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME -f create-thread-tables.sql

echo ""
echo "3. Generating mock thread data..."
PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME -f generate-thread-data.sql

echo ""
echo "4. Verifying data..."
PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME -f verify-thread-data.sql

echo ""
echo "=== Setup Complete ==="
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo "Password: $DB_PASS"
echo "Connection string: postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME"
echo ""
echo "To connect to the database:"
echo "PGPASSWORD=$DB_PASS psql -h localhost -U $DB_USER -d $DB_NAME"
echo ""
echo "To use with your Lambda function locally:"
echo "export DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME\""
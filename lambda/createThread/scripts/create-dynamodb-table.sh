#!/bin/bash

# Script to create DynamoDB table for threads

set -e

echo "Creating DynamoDB table for threads..."

TABLE_NAME="spool-threads"
REGION="us-east-1"

# Check if table already exists
if aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION >/dev/null 2>&1; then
    echo "Table $TABLE_NAME already exists."
    exit 0
fi

# Create table
echo "Creating table $TABLE_NAME..."
aws dynamodb create-table \
    --table-name $TABLE_NAME \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=studentId,AttributeType=S \
        AttributeName=createdAt,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        "IndexName=studentId-createdAt-index,Keys=[{AttributeName=studentId,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}],Projection={ProjectionType=ALL},BillingMode=PAY_PER_REQUEST" \
    --billing-mode PAY_PER_REQUEST \
    --tags \
        Key=Project,Value=spool \
        Key=Service,Value=threads \
        Key=Environment,Value=production \
    --region $REGION

echo "Waiting for table to be active..."
aws dynamodb wait table-exists --table-name $TABLE_NAME --region $REGION

echo "Table $TABLE_NAME created successfully!"
echo ""
echo "Table details:"
aws dynamodb describe-table --table-name $TABLE_NAME --region $REGION --query 'Table.{TableName:TableName,TableStatus:TableStatus,ItemCount:ItemCount}' --output json
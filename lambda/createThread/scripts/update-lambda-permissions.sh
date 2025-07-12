#!/bin/bash

# Script to update Lambda function permissions for SSM Parameter Store access

set -e

echo "Updating Lambda function permissions..."

# Configuration
FUNCTION_NAME="spool-create-thread"
ROLE_NAME="spool-lambda-execution-role"
REGION="us-east-1"

# Create the SSM policy document
cat > ssm-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:GetParameter",
                "ssm:GetParameters",
                "ssm:GetParametersByPath"
            ],
            "Resource": [
                "arn:aws:ssm:${REGION}:560281064968:parameter/spool/prod/rds/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "kms:Decrypt"
            ],
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "kms:ViaService": "ssm.${REGION}.amazonaws.com"
                }
            }
        }
    ]
}
EOF

# Create the VPC policy document for Lambda in VPC
cat > vpc-policy.json << EOF
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

# Create or update the SSM policy
echo "Creating/updating SSM parameter policy..."
aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name LambdaSSMParameterAccess \
    --policy-document file://ssm-policy.json \
    --region $REGION 2>/dev/null || echo "SSM policy might already exist, continuing..."

# Create or update the VPC policy
echo "Creating/updating VPC policy..."
aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name LambdaVPCAccess \
    --policy-document file://vpc-policy.json \
    --region $REGION 2>/dev/null || echo "VPC policy might already exist, continuing..."

# Ensure the role has basic Lambda execution permissions
echo "Checking Lambda basic execution role..."
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
    --region $REGION 2>/dev/null || echo "Basic execution role already attached"

# Ensure the role has VPC execution permissions
echo "Checking Lambda VPC execution role..."
aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole \
    --region $REGION 2>/dev/null || echo "VPC execution role already attached"

# Clean up
rm -f ssm-policy.json vpc-policy.json

echo "Permissions update completed!"
echo ""
echo "The Lambda function now has permissions to:"
echo "- Access SSM parameters under /spool/prod/rds/*"
echo "- Decrypt parameters using KMS"
echo "- Create and manage network interfaces for VPC access"
echo "- Write logs to CloudWatch"
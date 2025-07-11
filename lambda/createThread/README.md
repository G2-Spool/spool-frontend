# CreateThread Lambda Function

This Lambda function handles the creation of learning threads for the Spool platform.

## Architecture

- **Runtime**: Node.js 18.x
- **Handler**: `src/index.handler`
- **Database**: RDS PostgreSQL (shared with ECS services)
- **Authentication**: AWS Cognito
- **Network**: VPC-enabled for RDS access

## Endpoints

- `POST /api/thread/create` - Create a new learning thread
- `GET /api/thread/{id}` - Get thread by ID
- `GET /api/thread/list/{studentId}` - List threads for a student
- `PUT /api/thread/update/{id}` - Update thread

## Environment Variables

- `AWS_REGION` - AWS region (us-east-1)
- `COGNITO_USER_POOL_ID` - Cognito User Pool ID

## Database Connection

The Lambda function retrieves RDS connection details from AWS Systems Manager Parameter Store:
- `/spool/prod/rds/host`
- `/spool/prod/rds/port`
- `/spool/prod/rds/database`
- `/spool/prod/rds/username`
- `/spool/prod/rds/password`

## Data Model

```json
{
  "id": "uuid",
  "studentId": "cognito-sub",
  "title": "Thread Title",
  "description": "Thread Description",
  "interests": ["interest1", "interest2"],
  "concepts": ["concept1", "concept2"],
  "createdAt": "2025-07-11T00:00:00Z",
  "updatedAt": "2025-07-11T00:00:00Z",
  "status": "active"
}
```

## Deployment

```bash
# Package the Lambda function
npm run package

# Deploy using AWS CLI (requires ShpoolBot credentials)
npm run deploy
```
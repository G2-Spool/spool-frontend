# AWS Resources Inventory for Spool Platform

## Overview
This document contains all active AWS resources and their specific IDs/names for the Spool learning platform. Reference this document when working with infrastructure or deployments.

Last Updated: 2025-07-10

## 🌐 Frontend Resources

### AWS Amplify
- **App Name**: `spool-frontend`
- **App ID**: `dtsagfuinz4s7`
- **Default Domain**: `dtsagfuinz4s7.amplifyapp.com`
- **Custom Domain**: TBD (will be `app.spool.education`)
- **Branch**: `main`
- **Build Settings**: Configured in `amplify.yml`

## 🔐 Authentication

### AWS Cognito
- **User Pool ID**: `us-east-1_H7Kti5MPI`
- **User Pool Client ID**: `pr04p0ho9ovoccoahpbpbe06p`
- **Identity Pool ID**: `us-east-1:632470c2-0129-4215-925d-a6c6fca90d41`
- **Region**: `us-east-1`
- **User Pool Domain**: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_H7Kti5MPI`
- **Stack Name**: `CognitoStack`
- **Groups**: `students`, `parents`, `educators`, `admins`

## 🚪 API Gateway

### REST API ✅ DEPLOYED
- **Name**: `spool-api`
- **Stack Name**: `ApiGatewayStack`
- **Stage**: `prod`
- **API Gateway ID**: `alj6xppcj6`
- **URL**: `https://alj6xppcj6.execute-api.us-east-1.amazonaws.com/prod/`
- **Endpoints**:
  - `/api/interview/*` → Interview Service (via ALB)
  - `/api/content/*` → Content Service (via ALB)
  - `/api/exercise/*` → Exercise Service (via ALB)
  - `/api/progress/*` → Progress Service (via ALB)
  - `/api/health/*` → Health checks
- **Authentication**: Cognito User Pool Authorizer
- **API Key ID**: Check CloudFormation outputs

## 🐳 Container Services

### ECS Cluster
- **Cluster Name**: `spool-mvp`
- **Status**: ACTIVE
- **Active Services**: 2
- **Launch Type**: Fargate

### ECS Services
1. **Interview Service**
   - **Service Name**: `spool-interview-service`
   - **Task Definition**: `spool-interview-task:2`
   - **Port**: 8001
   - **Health Check**: `/health`

2. **Content Service**
   - **Service Name**: `spool-content-service`
   - **Task Definition**: `spool-content-service:2`
   - **Port**: 8002
   - **Health Check**: `/health`

3. **Exercise Service** (To be deployed)
   - **Service Name**: `spool-exercise-service`
   - **Port**: 8003
   - **Health Check**: `/health`

4. **Progress Service** (To be deployed)
   - **Service Name**: `spool-progress-service`
   - **Port**: 8004
   - **Health Check**: `/health`

### Application Load Balancer
- **Name**: `spool-backend-alb`
- **DNS**: `spool-backend-alb-1057793929.us-east-1.elb.amazonaws.com`
- **Scheme**: Internet-facing
- **Target Groups**: 
  - `spool-interview-tg` (port 8001)
  - `spool-content-tg` (port 8002)
  - `spool-exercise-tg` (port 8003) - TBD
  - `spool-progress-tg` (port 8004) - TBD

## 🔨 CI/CD Resources

### CodeBuild Projects
1. **Backend Build**: `spool-backend-build`
2. **Exercise Service Build**: `spool-exercise-service-build`

### ECR Repositories
- `spool-interview-service`
- `spool-content-service`
- `spool-exercise-service`
- `spool-progress-service`

## 💾 Databases

### RDS PostgreSQL
- **Instance**: Not yet deployed
- **Engine**: PostgreSQL 15.3
- **Stack**: Will be in `SpoolEcsStack`
- **Multi-AZ**: Yes (production)

### Neo4j AuraDB
- **Instance**: Not yet configured
- **Type**: Professional tier
- **Purpose**: Knowledge graph for curriculum

### Pinecone Vector Database
- **Environment**: Stored in SSM: `/spool/PINECONE_ENVIRONMENT`
- **Index Name**: Stored in SSM: `/spool/PINECONE_INDEX_NAME`
- **API Key**: Stored in SSM: `/spool/PINECONE_API_KEY`
- **Dimension**: 1536 (OpenAI embeddings)

## 🔑 Secrets & Parameters (Systems Manager)

### API Keys
- `/spool/openai-api-key` - OpenAI API key (SecureString)
- `/spool/PINECONE_API_KEY` - Pinecone API key
- `/spool/PINECONE_OPENAI_API_KEY` - OpenAI key for Pinecone

### Configuration
- `/spool/PINECONE_ENVIRONMENT` - Pinecone environment
- `/spool/PINECONE_INDEX_NAME` - Pinecone index name
- `/spool/cognito/user-pool-id` - Cognito User Pool ID
- `/spool/cognito/user-pool-client-id` - Client ID
- `/spool/cognito/identity-pool-id` - Identity Pool ID
- `/spool/cognito/region` - AWS Region

### API Gateway Endpoints (After deployment)
- `/spool/api-gateway/url` - Base API Gateway URL
- `/spool/api-gateway/endpoints/interview` - Interview endpoint
- `/spool/api-gateway/endpoints/content` - Content endpoint
- `/spool/api-gateway/endpoints/exercise` - Exercise endpoint
- `/spool/api-gateway/endpoints/progress` - Progress endpoint

## 🌐 Networking

### VPC (To be created)
- **Name**: `SpoolVpc`
- **CIDR**: 10.0.0.0/16
- **AZs**: 2
- **NAT Gateways**: 1 (dev) / 2 (prod)

### Security Groups
- `AlbSecurityGroup` - For ALB (ports 80, 443)
- `ServiceSecurityGroup` - For ECS services
- `RdsSecurityGroup` - For RDS (port 5432)

## 📊 Monitoring

### CloudWatch Log Groups
- `/ecs/interview-service`
- `/ecs/content-service`
- `/ecs/exercise-service`
- `/ecs/progress-service`
- `/aws/api-gateway/spool-api/access`
- `/aws/api-gateway/spool-api/execution`

### X-Ray
- Service Map: `spool-api`
- Traces enabled for API Gateway and ECS services

## 🏷️ Resource Tags

All resources should be tagged with:
- `Project`: `spool`
- `Environment`: `dev` / `prod`
- `ManagedBy`: `CDK` / `Console`
- `Owner`: `devops@spool.education`

## 📝 CloudFormation Stacks

### Active Stacks
1. **CognitoStack** - ✅ DEPLOYED
   - Status: CREATE_COMPLETE
   - Created: 2025-07-10

2. **ApiGatewayStack** - 🚧 PENDING
   - Dependencies: CognitoStack, ALB URLs

3. **SpoolEcsStack** - ❌ NOT USED
   - Using existing `spool-mvp` cluster instead

## 🔄 Deployment Order

1. ✅ Cognito Stack (Authentication)
2. ✅ ECS Cluster & Services (Existing `spool-mvp`)
3. 🚧 API Gateway Stack (In Progress)
4. 📅 RDS Database (Future)
5. 📅 Neo4j Setup (Future)

## 📞 Support Contacts

- **AWS Account ID**: `560281064968`
- **Primary Region**: `us-east-1`
- **AWS CLI User**: `ShpoolBot` (for deployments)
- **Infrastructure User**: `InfraBot` (for other operations)

## 🔗 Quick Links

### AWS Console Links
- [ECS Cluster](https://console.aws.amazon.com/ecs/home?region=us-east-1#/clusters/spool-mvp)
- [Amplify App](https://console.aws.amazon.com/amplify/home?region=us-east-1#/dtsagfuinz4s7)
- [Cognito User Pool](https://console.aws.amazon.com/cognito/users/?region=us-east-1#/pool/us-east-1_H7Kti5MPI)
- [Load Balancer](https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#LoadBalancers:search=spool-backend-alb)
- [CloudFormation Stacks](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks)

### Service Endpoints (Current)
- **Frontend**: https://dtsagfuinz4s7.amplifyapp.com
- **Backend ALB**: http://spool-backend-alb-1057793929.us-east-1.elb.amazonaws.com

---

**Note**: This document should be updated whenever new resources are created or modified. Always verify resource status in AWS Console before making changes.
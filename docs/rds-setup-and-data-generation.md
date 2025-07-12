# RDS Setup and Thread Data Generation Guide

## Current Status
As of the analysis, the RDS PostgreSQL instance for Spool has **not been deployed yet**. This guide provides instructions for:
1. Deploying the RDS instance
2. Creating the necessary database schema
3. Generating mock thread data for users

## 1. RDS Deployment Instructions

### Using AWS CLI to Create RDS Instance

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier spool-prod-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.3 \
  --allocated-storage 20 \
  --storage-type gp3 \
  --master-username spooladmin \
  --master-user-password [SECURE_PASSWORD] \
  --vpc-security-group-ids [SECURITY_GROUP_ID] \
  --db-subnet-group-name [SUBNET_GROUP_NAME] \
  --backup-retention-period 7 \
  --multi-az \
  --storage-encrypted \
  --tags Key=Environment,Value=prod Key=Project,Value=spool \
  --region us-east-1

# Wait for instance to be available
aws rds wait db-instance-available \
  --db-instance-identifier spool-prod-db \
  --region us-east-1

# Get the endpoint
aws rds describe-db-instances \
  --db-instance-identifier spool-prod-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text \
  --region us-east-1
```

### Store Connection Details in SSM Parameter Store

```bash
# Store RDS connection parameters
aws ssm put-parameter \
  --name "/spool/prod/rds/host" \
  --value "[RDS_ENDPOINT]" \
  --type "String" \
  --region us-east-1

aws ssm put-parameter \
  --name "/spool/prod/rds/port" \
  --value "5432" \
  --type "String" \
  --region us-east-1

aws ssm put-parameter \
  --name "/spool/prod/rds/database" \
  --value "spool" \
  --type "String" \
  --region us-east-1

aws ssm put-parameter \
  --name "/spool/prod/rds/username" \
  --value "spooladmin" \
  --type "String" \
  --region us-east-1

aws ssm put-parameter \
  --name "/spool/prod/rds/password" \
  --value "[SECURE_PASSWORD]" \
  --type "SecureString" \
  --region us-east-1
```

## 2. Database Schema Creation

### Connect to RDS and Create Database

```bash
# Connect to RDS (replace with actual endpoint)
PGPASSWORD=[PASSWORD] psql \
  -h [RDS_ENDPOINT] \
  -U spooladmin \
  -d postgres \
  -c "CREATE DATABASE spool;"
```

### Create Tables Schema

Save this as `create-tables.sql`:

```sql
-- Connect to spool database
\c spool;

-- Create threads table (simplified version matching threadService.js)
CREATE TABLE IF NOT EXISTS threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    interests TEXT[] DEFAULT '{}',
    concepts TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system'
);

-- Create thread_analysis table
CREATE TABLE IF NOT EXISTS thread_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    subjects TEXT[] NOT NULL,
    topics TEXT[] NOT NULL,
    concepts TEXT[] NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create thread_sections table
CREATE TABLE IF NOT EXISTS thread_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    section_number INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    text TEXT NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 0.85,
    course_id VARCHAR(255),
    concept_ids TEXT[] DEFAULT '{}',
    difficulty VARCHAR(50) DEFAULT 'intermediate',
    estimated_minutes INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_threads_student ON threads(student_id);
CREATE INDEX idx_threads_status ON threads(status);
CREATE INDEX idx_thread_sections_thread ON thread_sections(thread_id);
CREATE INDEX idx_thread_analysis_thread ON thread_analysis(thread_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_threads_updated_at BEFORE UPDATE
    ON threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Execute Schema Creation

```bash
# Run the SQL file
PGPASSWORD=[PASSWORD] psql \
  -h [RDS_ENDPOINT] \
  -U spooladmin \
  -d spool \
  -f create-tables.sql
```

## 3. Generate Mock Thread Data

### User Pool Information
- **User Pool ID**: us-east-1_TBQtRz0K6
- **Region**: us-east-1

### Mock Data Generation SQL

Save this as `generate-mock-data.sql`:

```sql
-- This script will be populated with actual user IDs from Cognito
-- For now, using placeholder user IDs

-- Function to generate random thread data
CREATE OR REPLACE FUNCTION generate_thread_data(
    p_user_id VARCHAR(255),
    p_user_email VARCHAR(255)
) RETURNS UUID AS $$
DECLARE
    v_thread_id UUID;
    v_questions TEXT[] := ARRAY[
        'How can I build a video game that teaches climate science?',
        'What math do I need to understand machine learning?',
        'How does the human brain process music and emotions?',
        'Can you explain quantum computing using everyday examples?',
        'How do I create a mobile app for environmental monitoring?',
        'What''s the connection between art history and modern UI design?',
        'How can I use data science to analyze sports performance?',
        'What physics concepts are used in special effects?',
        'How do I build a robot that can navigate autonomously?',
        'What''s the relationship between nutrition and cognitive performance?'
    ];
    v_question TEXT;
    v_subjects TEXT[];
    v_topics TEXT[];
    v_concepts TEXT[];
    v_summary TEXT;
    v_num_sections INTEGER;
    i INTEGER;
BEGIN
    -- Select a random question
    v_question := v_questions[floor(random() * array_length(v_questions, 1) + 1)];
    
    -- Create the thread
    INSERT INTO threads (student_id, title, description, interests, concepts, status)
    VALUES (
        p_user_id,
        v_question,
        'Generated learning thread for ' || p_user_email,
        ARRAY['technology', 'science', 'learning'],
        ARRAY['programming', 'mathematics', 'critical-thinking'],
        'active'
    ) RETURNING id INTO v_thread_id;
    
    -- Generate appropriate subjects, topics, and concepts based on the question
    IF v_question LIKE '%video game%' THEN
        v_subjects := ARRAY['Computer Science', 'Physics', 'Mathematics', 'Environmental Science'];
        v_topics := ARRAY['Game Development', 'Climate Modeling', 'Educational Technology'];
        v_concepts := ARRAY['Game Engines', 'Physics Simulation', 'Climate Data', 'User Engagement'];
        v_summary := 'Learn to create educational games that teach climate science through interactive simulations and engaging gameplay mechanics.';
    ELSIF v_question LIKE '%machine learning%' THEN
        v_subjects := ARRAY['Mathematics', 'Computer Science', 'Statistics'];
        v_topics := ARRAY['Linear Algebra', 'Calculus', 'Probability', 'Algorithms'];
        v_concepts := ARRAY['Matrices', 'Derivatives', 'Gradient Descent', 'Neural Networks'];
        v_summary := 'Master the mathematical foundations essential for understanding and implementing machine learning algorithms.';
    ELSIF v_question LIKE '%brain%music%' THEN
        v_subjects := ARRAY['Neuroscience', 'Psychology', 'Music Theory', 'Biology'];
        v_topics := ARRAY['Auditory Processing', 'Emotion', 'Neural Pathways', 'Music Perception'];
        v_concepts := ARRAY['Auditory Cortex', 'Dopamine', 'Rhythm Processing', 'Emotional Response'];
        v_summary := 'Explore how the brain processes musical information and generates emotional responses through complex neural mechanisms.';
    ELSE
        v_subjects := ARRAY['Science', 'Technology', 'Mathematics'];
        v_topics := ARRAY['Problem Solving', 'Critical Thinking', 'Applied Learning'];
        v_concepts := ARRAY['Analysis', 'Synthesis', 'Application', 'Evaluation'];
        v_summary := 'Develop interdisciplinary understanding through hands-on exploration and practical application.';
    END IF;
    
    -- Insert thread analysis
    INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
    VALUES (v_thread_id, v_subjects, v_topics, v_concepts, v_summary);
    
    -- Generate 3-5 sections per thread
    v_num_sections := floor(random() * 3 + 3);
    
    FOR i IN 1..v_num_sections LOOP
        INSERT INTO thread_sections (
            thread_id,
            section_number,
            title,
            text,
            relevance_score,
            difficulty,
            estimated_minutes
        ) VALUES (
            v_thread_id,
            i,
            CASE i
                WHEN 1 THEN 'Introduction and Prerequisites'
                WHEN 2 THEN 'Core Concepts and Theory'
                WHEN 3 THEN 'Practical Applications'
                WHEN 4 THEN 'Advanced Techniques'
                ELSE 'Project Implementation'
            END,
            CASE i
                WHEN 1 THEN 'This section introduces the fundamental concepts you''ll need to understand before diving into the main topic. We''ll cover basic terminology, historical context, and why this knowledge is valuable in today''s world.'
                WHEN 2 THEN 'Here we explore the theoretical foundations and core principles. You''ll learn about the key mechanisms, processes, and relationships that form the backbone of this subject area.'
                WHEN 3 THEN 'Time to put theory into practice! This section demonstrates real-world applications and provides hands-on examples you can try yourself. You''ll see how these concepts apply to everyday situations.'
                WHEN 4 THEN 'Ready to go deeper? This section covers advanced topics and cutting-edge developments. We''ll explore current research, emerging trends, and sophisticated techniques used by professionals.'
                ELSE 'Bring it all together with a comprehensive project. This section guides you through creating something meaningful that demonstrates your understanding of all the concepts covered.'
            END,
            0.75 + random() * 0.20, -- Relevance score between 0.75 and 0.95
            CASE 
                WHEN i <= 2 THEN 'beginner'
                WHEN i <= 4 THEN 'intermediate'
                ELSE 'advanced'
            END,
            floor(random() * 7 + 4) -- 4-10 minutes per section
        );
    END LOOP;
    
    RETURN v_thread_id;
END;
$$ LANGUAGE plpgsql;

-- Generate threads for specific users
-- Note: Replace these with actual user IDs from your Cognito user pool
DO $$
DECLARE
    v_users RECORD;
    v_thread_id UUID;
BEGIN
    -- Example users (replace with actual Cognito user data)
    FOR v_users IN 
        SELECT * FROM (VALUES
            ('user-1', 'student1@example.com'),
            ('user-2', 'student2@example.com'),
            ('user-3', 'student3@example.com')
        ) AS t(user_id, email)
    LOOP
        -- Generate 2-4 threads per user
        FOR i IN 1..floor(random() * 3 + 2) LOOP
            v_thread_id := generate_thread_data(v_users.user_id, v_users.email);
            RAISE NOTICE 'Created thread % for user %', v_thread_id, v_users.user_id;
        END LOOP;
    END LOOP;
END $$;
```

## 4. Execute Data Generation

### Step 1: Get actual users from Cognito

```bash
# List users and format for SQL
aws cognito-idp list-users \
  --user-pool-id us-east-1_TBQtRz0K6 \
  --region us-east-1 \
  --output json | \
  jq -r '.Users[] | 
    "SELECT generate_thread_data('\''\(.Username)'\'', '\''\(.Attributes[] | select(.Name == "email") | .Value)'\'');"' > generate-for-users.sql
```

### Step 2: Run data generation

```bash
# Execute the mock data generation
PGPASSWORD=[PASSWORD] psql \
  -h [RDS_ENDPOINT] \
  -U spooladmin \
  -d spool \
  -f generate-mock-data.sql

# Generate data for actual users
PGPASSWORD=[PASSWORD] psql \
  -h [RDS_ENDPOINT] \
  -U spooladmin \
  -d spool \
  -f generate-for-users.sql
```

## 5. Verify Data Generation

```bash
# Check thread count
PGPASSWORD=[PASSWORD] psql \
  -h [RDS_ENDPOINT] \
  -U spooladmin \
  -d spool \
  -c "SELECT COUNT(*) as thread_count FROM threads;"

# Check data structure
PGPASSWORD=[PASSWORD] psql \
  -h [RDS_ENDPOINT] \
  -U spooladmin \
  -d spool \
  -c "SELECT t.*, ta.subjects, ta.topics, ta.summary 
      FROM threads t 
      JOIN thread_analysis ta ON t.id = ta.thread_id 
      LIMIT 1;"
```

## 6. Update Lambda Environment Variables

```bash
# Add DATABASE_URL to Lambda function
aws lambda update-function-configuration \
  --function-name spool-create-thread \
  --environment Variables="{DATABASE_URL=postgresql://spooladmin:[PASSWORD]@[RDS_ENDPOINT]:5432/spool}" \
  --region us-east-1
```

## Notes

1. **Security**: Ensure RDS security group allows connections from Lambda functions and bastion host only
2. **Backups**: RDS multi-AZ and automated backups are configured for production
3. **Monitoring**: Set up CloudWatch alarms for RDS metrics
4. **Connection Pooling**: Consider implementing connection pooling in Lambda for better performance
5. **Data Privacy**: Ensure mock data doesn't contain any real student information

## Next Steps

After RDS deployment and data generation:
1. Test Lambda function connectivity to RDS
2. Verify API Gateway can retrieve thread data
3. Test the /threads page displays live data from RDS
4. Implement proper error handling and retry logic
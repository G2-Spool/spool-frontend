import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { v4 as uuidv4 } from 'uuid';

// Create an example learning path that matches our thread concept
const exampleLearningPath = {
  id: 'example-thread-001',
  studentProfileId: 'example-student-001', // This would need to exist in student_profiles
  subject: 'Machine Learning',
  
  // Analysis equivalent for threads
  currentTopicId: 'topic_neural_networks',
  currentSectionId: 'section_nn_fundamentals', 
  currentConceptId: 'concept_nn_learning',
  
  // Progress tracking
  conceptsCompleted: 0,
  conceptsTotal: 5,
  conceptsMastered: 0,
  averageMasteryScore: 0,
  
  // Settings
  dailyTargetMinutes: 30,
  status: 'active',
  
  // Available concepts (sections in thread terminology)
  availableConcepts: [
    'concept_nn_basics',
    'concept_nn_learning',
    'concept_gradient_descent',
    'concept_predictions',
    'concept_applications'
  ]
};

async function deployLambdaAndCreatePath() {
  try {
    console.log('Creating example learning path via Lambda...');
    
    const lambdaClient = new LambdaClient({ region: 'us-east-1' });
    
    // First, let's check if the Lambda function exists
    const payload = {
      httpMethod: 'POST',
      path: '/api/thread/create',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        learningPath: exampleLearningPath
      })
    };
    
    const command = new InvokeCommand({
      FunctionName: 'spool-create-thread',
      Payload: JSON.stringify(payload)
    });
    
    console.log('Invoking Lambda function...');
    const response = await lambdaClient.send(command);
    
    const result = JSON.parse(new TextDecoder().decode(response.Payload));
    console.log('Lambda response:', result);
    
    if (result.statusCode === 200) {
      console.log('Successfully created example learning path!');
      console.log('Path ID:', exampleLearningPath.id);
    } else {
      console.error('Failed to create learning path:', result);
    }
    
  } catch (error) {
    console.error('Error:', error);
    console.log('\nLambda function may not be deployed yet.');
    console.log('To deploy the Lambda function:');
    console.log('1. cd lambda/createThread');
    console.log('2. npm run deploy');
  }
}

// Alternative: Create SQL script for direct insertion
async function generateSQLScript() {
  console.log('\nGenerating SQL script for direct database insertion...\n');
  
  const sql = `
-- First, ensure we have a student profile for the example
INSERT INTO student_profiles (
  id,
  user_id,
  first_name,
  last_name,
  interests,
  career_interests,
  life_category_weights
) VALUES (
  'example-student-001',
  'example-user-001',
  'Example',
  'Student',
  '[{"interest": "Neural Networks", "category": "Technology", "strength": 0.9}]'::jsonb,
  '["AI Research", "Machine Learning Engineering"]'::jsonb,
  '{"personal": 0.25, "social": 0.25, "career": 0.25, "philanthropic": 0.25}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Create the example learning path (thread equivalent)
INSERT INTO learning_paths (
  id,
  student_profile_id,
  subject,
  current_topic_id,
  current_section_id,
  current_concept_id,
  available_concepts,
  concepts_completed,
  concepts_total,
  concepts_mastered,
  average_mastery_score,
  daily_target_minutes,
  status,
  started_at,
  last_accessed_at
) VALUES (
  'example-thread-001',
  'example-student-001',
  'Machine Learning',
  'topic_neural_networks',
  'section_nn_fundamentals',
  'concept_nn_learning',
  ARRAY['concept_nn_basics', 'concept_nn_learning', 'concept_gradient_descent', 'concept_predictions', 'concept_applications'],
  0,
  5,
  0,
  0.0,
  30,
  'active',
  NOW(),
  NOW()
) ON CONFLICT (student_profile_id, subject) DO UPDATE SET
  last_accessed_at = NOW();

-- Verify the insertion
SELECT 
  id,
  subject,
  current_concept_id,
  concepts_total,
  status,
  started_at
FROM learning_paths 
WHERE id = 'example-thread-001';
`;
  
  console.log(sql);
  console.log('\nTo execute this SQL:');
  console.log('1. Connect to RDS using psql or a database client');
  console.log('2. Run the SQL commands above');
  console.log('3. The example learning path will be created with ID: example-thread-001');
}

// Run both approaches
async function main() {
  // Try Lambda approach first
  await deployLambdaAndCreatePath();
  
  // Generate SQL as backup
  await generateSQLScript();
}

main().catch(console.error);
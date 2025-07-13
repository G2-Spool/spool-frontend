# Supabase Edge Functions

This directory contains all Supabase Edge Functions for the Spool learning platform.

## Functions Overview

### 1. interest-discovery
Handles chat-based interest discovery for students.

**Actions:**
- `start_session` - Initialize a new chat session
- `process_message` - Process user messages and extract interests
- `get_interests` - Retrieve all interests for a student

**Usage:**
```javascript
const { data } = await supabase.functions.invoke('interest-discovery', {
  body: { 
    action: 'process_message',
    studentId: 'student-id',
    messages: [...],
    newMessage: 'I love basketball'
  }
});
```

### 2. thread-discovery
Extracts learning goals from conversations to create learning thread proposals.

**Parameters:**
- `conversation` - The text conversation to analyze
- `studentId` - Student profile ID

**Returns:**
Thread proposal with goal, objectives, depth preference, and confidence score.

### 3. thread-generation
Generates a complete learning thread with cross-curricular concepts based on a proposal.

**Parameters:**
- `proposal` - Thread proposal from thread-discovery
- `studentProfileId` - Student profile ID

**Returns:**
Created thread with mapped concepts, visualization data, and estimated hours.

### 4. content-assembly
Assembles personalized content for a specific concept within a thread.

**Parameters:**
- `conceptId` - The concept to generate content for
- `threadId` - The thread context
- `studentId` - Student profile ID

**Returns:**
Personalized content including hooks, examples, core content, and bridge explanations.

### 5. exercise-generation
Generates personalized exercises for concepts.

**Parameters:**
- `conceptId` - The concept to test
- `threadId` - Thread context
- `studentId` - Student profile ID
- `exerciseType` - 'initial' or 'advanced'

**Returns:**
Exercise with prompt, expected steps, success criteria, and metadata.

### 6. progress-tracking
Tracks student progress through threads and concepts.

**Actions:**
- `update_concept_progress` - Update concept completion status
- `get_thread_progress` - Get comprehensive thread progress
- `create_progress_snapshot` - Create periodic progress snapshot
- `track_achievement` - Track gamification achievements

## Environment Variables

All functions require these environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for admin access
- `OPENAI_API_KEY` - OpenAI API key for GPT-4 access

## Deployment

To deploy these functions using Supabase MCP:

```javascript
// Deploy a function
await supabase.functions.deploy('function-name', {
  entrypoint: 'index.ts',
  files: [{ name: 'index.ts', content: '...' }]
});
```

## CORS Configuration

All functions include CORS headers for cross-origin requests:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

## Error Handling

All functions return standardized error responses:
```javascript
{
  error: "Error message",
  // HTTP status 400 for client errors
}
```

## Testing

Test functions locally using the Supabase CLI:
```bash
supabase functions serve function-name
```

Then make requests to:
```
http://localhost:54321/functions/v1/function-name
``` 
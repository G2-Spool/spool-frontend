# Supabase Edge Functions Guide

## Introduction

This guide provides comprehensive documentation for all Supabase Edge Functions used in the Spool Learning Platform. These functions power the AI-driven features of the platform, from interest discovery to progress tracking.

## Shared Configuration

### CORS Headers

All edge functions use a shared CORS configuration defined in `_shared/cors.ts`:

```typescript
// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Use specific domain in production
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
```

**Important**: For production deployment, update the `Access-Control-Allow-Origin` to your specific frontend domain (e.g., `'https://your-app.com'`) for better security.

## Edge Functions Overview

The Spool platform uses six Edge Functions that work together:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│ Interest        │────▶│ Thread           │────▶│ Thread          │
│ Discovery       │     │ Discovery        │     │ Generation      │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│ Progress        │◀────│ Exercise         │◀────│ Content         │
│ Tracking        │     │ Generation       │     │ Assembly        │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## Function Details

### 1. Interest Discovery (`interest-discovery`)

Captures student interests through conversational chat.

**Frontend Usage:**
```typescript
// Start a chat session
const { data } = await supabase.functions.invoke('interest-discovery', {
  body: { 
    action: 'start_session',
    studentId: 'student-uuid'
  }
});

// Process a message
const { data } = await supabase.functions.invoke('interest-discovery', {
  body: { 
    action: 'process_message',
    studentId: 'student-uuid',
    messages: [...previousMessages],
    newMessage: 'I love playing basketball and coding'
  }
});
```

### 2. Thread Discovery (`thread-discovery`)

Extracts learning goals from conversations.

**Frontend Usage:**
```typescript
const { data } = await supabase.functions.invoke('thread-discovery', {
  body: { 
    conversation: 'I want to build a mobile game...',
    studentId: 'student-uuid'
  }
});

// Returns: { goal, objectives, depth, motivation, confidence_score }
```

### 3. Thread Generation (`thread-generation`)

Creates a complete learning thread with cross-curricular concepts.

**Frontend Usage:**
```typescript
const { data } = await supabase.functions.invoke('thread-generation', {
  body: { 
    proposal: threadProposal, // from thread-discovery
    studentProfileId: 'student-uuid'
  }
});

// Returns: { thread, visualization_data }
```

### 4. Content Assembly (`content-assembly`)

Generates personalized content for each concept.

**Frontend Usage:**
```typescript
const { data } = await supabase.functions.invoke('content-assembly', {
  body: { 
    conceptId: 'concept-uuid',
    threadId: 'thread-uuid',
    studentId: 'student-uuid'
  }
});

// Returns: { hooks, examples, core_content, bridge_content }
```

### 5. Exercise Generation (`exercise-generation`)

Creates personalized exercises for concepts.

**Frontend Usage:**
```typescript
const { data } = await supabase.functions.invoke('exercise-generation', {
  body: { 
    conceptId: 'concept-uuid',
    threadId: 'thread-uuid',
    studentId: 'student-uuid',
    exerciseType: 'initial' // or 'advanced'
  }
});

// Returns: { exercise, expected_steps, success_criteria }
```

### 6. Progress Tracking (`progress-tracking`)

Tracks student progress and achievements.

**Frontend Usage:**
```typescript
// Update concept progress
const { data } = await supabase.functions.invoke('progress-tracking', {
  body: { 
    action: 'update_concept_progress',
    threadId: 'thread-uuid',
    conceptId: 'concept-uuid',
    studentId: 'student-uuid',
    data: {
      status: 'completed',
      masteryLevel: 0.85,
      timeSpent: 1200 // seconds
    }
  }
});

// Get thread progress
const { data } = await supabase.functions.invoke('progress-tracking', {
  body: { 
    action: 'get_thread_progress',
    threadId: 'thread-uuid',
    studentId: 'student-uuid'
  }
});
```

## Local Development

1. **Install Supabase CLI:**
   ```bash
   brew install supabase/tap/supabase
   ```

2. **Start local Supabase:**
   ```bash
   supabase start
   ```

3. **Run functions locally:**
   ```bash
   supabase functions serve interest-discovery --env-file .env.local
   ```

4. **Test locally:**
   ```bash
   curl -X POST http://localhost:54321/functions/v1/interest-discovery \
     -H "Content-Type: application/json" \
     -d '{"action": "start_session", "studentId": "test-id"}'
   ```

## Deployment

1. **Set environment variables:**
   ```bash
   export SUPABASE_PROJECT_URL=https://your-project.supabase.co
   export SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Deploy all functions:**
   ```bash
   ./supabase/deploy-functions.sh
   ```

3. **Set secrets:**
   ```bash
   supabase secrets set OPENAI_API_KEY=your-api-key \
     --project-ref your-project-ref
   ```

## Environment Variables

Each function requires:
- `SUPABASE_URL` - Automatically provided
- `SUPABASE_SERVICE_ROLE_KEY` - Automatically provided
- `OPENAI_API_KEY` - Must be set as secret

## Error Handling

All functions return consistent error responses:

```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  error: "Error message",
  // HTTP 400 status
}
```

## Best Practices

1. **Always handle CORS preflight:**
   ```typescript
   if (req.method === 'OPTIONS') {
     return new Response('ok', { headers: corsHeaders })
   }
   ```

2. **Use proper error handling:**
   ```typescript
   try {
     // Your logic
   } catch (error) {
     console.error('Function error:', error)
     return new Response(
       JSON.stringify({ error: error.message }),
       { status: 400, headers: corsHeaders }
     )
   }
   ```

3. **Validate inputs:**
   ```typescript
   const { required_param } = await req.json()
   if (!required_param) {
     throw new Error('Missing required parameter')
   }
   ```

4. **Use TypeScript types:**
   ```typescript
   interface RequestBody {
     action: 'start_session' | 'process_message'
     studentId: string
   }
   ```

## Monitoring

Monitor function performance in Supabase Dashboard:
- Functions → Select function → Logs
- Functions → Select function → Metrics

## Troubleshooting

### Function not deploying
- Check Supabase CLI version: `supabase --version`
- Verify project reference: `supabase projects list`

### CORS errors
- Ensure all responses include CORS headers
- Check allowed origins in production

### OpenAI errors
- Verify OPENAI_API_KEY is set
- Check API rate limits
- Monitor token usage

### Database errors
- Verify table schema matches
- Check RLS policies
- Use service role key for admin operations 
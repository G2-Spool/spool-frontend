# Supabase Error Fixes

## Interest Discovery Edge Function - Invalid Action Error

### Error Details
**Date**: July 13, 2025  
**Function**: `interest-discovery`  
**Error Message**: `Interest discovery error: Error: Invalid action`  
**Location**: Line 183 in `/supabase/functions/interest-discovery/index.ts`

### Error Context
The error occurs when the InterestDiscoveryModal submits a request to extract interests from user text. The edge function throws an "Invalid action" error despite the frontend correctly sending `action: 'extract_interests'`.

### Root Cause Analysis

The issue appears to be related to how the request body is being parsed in the edge function. When using `supabase.functions.invoke()`, there can be differences in how the request is structured compared to a standard HTTP request.

### Potential Issues Identified

1. **Request Body Parsing**: The edge function expects the request body to be directly accessible via `req.json()`, but Supabase Functions might wrap or structure the body differently.

2. **Content-Type Headers**: The request might not have the correct Content-Type header, causing parsing issues.

3. **Case Sensitivity**: The action string comparison might be affected by case sensitivity or whitespace.

### Solution

Update the interest-discovery edge function to handle request body parsing more robustly:

```typescript
// Updated request body parsing
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // More robust body parsing
    let body;
    try {
      const rawBody = await req.json();
      // Handle both direct body and wrapped body scenarios
      body = rawBody.body || rawBody;
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      throw new Error('Invalid request body');
    }

    const { action, studentId, text } = body;
    
    // Add debugging
    console.log('Received request:', { action, studentId, hasText: !!text });
    
    // Normalize action string
    const normalizedAction = action?.trim()?.toLowerCase();
    
    if (normalizedAction === 'extract_interests') {
      // ... existing extract_interests logic
    } else if (normalizedAction === 'start_session') {
      // ... existing start_session logic
    } else {
      console.error('Unknown action received:', action);
      throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    // ... error handling
  }
})
```

### Alternative Solution - Update Frontend

If the edge function expects a different structure, update the frontend call:

```typescript
// In InterestDiscoveryModal.tsx
const response = await fetch(`${supabaseUrl}/functions/v1/interest-discovery`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${session?.access_token}`,
  },
  body: JSON.stringify({
    action: 'extract_interests',
    studentId,
    text: inputValue.trim()
  })
});
```

### Debugging Steps

1. **Add Logging**: Add comprehensive logging to the edge function to see exactly what's being received:
   ```typescript
   console.log('Raw request:', await req.text());
   ```

2. **Check Supabase Logs**: Review the full logs in Supabase Dashboard under Edge Functions > Logs

3. **Test with curl**: Test the function directly to isolate frontend issues:
   ```bash
   curl -X POST https://ubtwzfbtfekmgvswlfsd.supabase.co/functions/v1/interest-discovery \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     -d '{"action": "extract_interests", "studentId": "test-id", "text": "I love basketball"}'
   ```

### Immediate Fix

The most likely fix is to update the edge function to handle the wrapped body structure:

```typescript
const rawBody = await req.json();
const { action, studentId, text } = rawBody.body || rawBody;
```

This handles both direct body access and the case where Supabase wraps the body in a `body` property.

### Prevention

1. Always add comprehensive logging when developing edge functions
2. Test edge functions with multiple client types (curl, Postman, SDK)
3. Handle multiple body structures to ensure compatibility
4. Use TypeScript interfaces to enforce request/response contracts

### Deployment Instructions

After applying the fix to the edge function, deploy it using:

```bash
# Using the deployment script
./supabase/deploy-interest-discovery.sh

# Or manually
npx supabase functions deploy interest-discovery --no-verify-jwt
```

To monitor logs after deployment:
```bash
npx supabase functions logs interest-discovery
```

### Testing the Fix

1. Open the application and navigate to the Student Dashboard
2. Click on "Add Interests" if no interests exist
3. Enter some text about your interests
4. Submit the form
5. Check the browser console and Supabase logs for any errors

If the error persists, check the logs to see what values are being received for the `action` parameter. 
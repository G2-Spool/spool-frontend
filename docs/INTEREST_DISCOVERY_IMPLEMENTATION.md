# Interest Discovery Implementation

## Overview
This document describes the implementation of the interest discovery feature, which allows students to discover and capture their interests through a conversational chat interface.

## Database Schema
Added `detailed_interests` column to `student_profiles` table:
```sql
detailed_interests JSONB DEFAULT '[]'::jsonb
```

Structure:
```json
[
  {
    "interest": "Basketball",
    "details": "I love the teamwork aspect and the strategy behind plays",
    "discovered_at": "2025-01-12T19:00:00Z"
  }
]
```

## Edge Function: interest-discovery

The edge function handles:
- `start_session`: Initializes a new chat session
- `process_message`: Processes user messages and extracts interests
- `get_interests`: Retrieves all interests for a student

### API Endpoint
```
POST https://ubtwzfbtfekmgvswlfsd.supabase.co/functions/v1/interest-discovery
```

### Example Usage
```javascript
const { data } = await supabase.functions.invoke('interest-discovery', {
  body: { 
    action: 'process_message', 
    studentId: 'student-id',
    messages: [...previousMessages],
    newMessage: 'I love playing basketball'
  }
});
```

## React Components

### InterestDiscoveryModal
A chat modal that guides students through interest discovery:
- Real-time chat interface
- Auto-extraction of interests during conversation
- Visual feedback for discovered interests
- Auto-close when sufficient interests are found

### InterestDetailCard
Displays individual interests with:
- Interest name and details
- Time since discovery
- Gradient styling based on interest name
- "Explore Learning Paths" action button

### useInterests Hook
Manages interest data:
- Fetches interests from Supabase
- Updates interests
- Provides loading and error states

## User Flow

1. **Dashboard Display**
   - Users see their discovered interests as cards
   - Empty state prompts to "Start Chat"

2. **Discovery Process**
   - Click "Discover More" or "Start Chat"
   - Chat modal opens with friendly greeting
   - User shares interests naturally in conversation
   - AI extracts interests with details in real-time
   - Pills show discovered interests below chat

3. **Interest Cards**
   - Display on dashboard after discovery
   - Show interest name, details, and time
   - Click to explore related learning paths

## Sample Data
Three students with varied interests:
- **Sarah**: Gaming, Digital Art, Robotics
- **Marcus**: Basketball, Music Production, Photography, Social Justice  
- **Emily**: Creative Writing, Theater, Climate Change, Cooking, Sustainable Living

## Future Enhancements
1. Interest strength/confidence scoring
2. Interest evolution tracking over time
3. Interest-based learning path recommendations
4. Social features (find peers with similar interests)
5. Interest categories and tagging 
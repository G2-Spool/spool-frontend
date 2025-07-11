# Voice Interview Feature

## Overview
The Voice Interview Page provides a chat-based interface for discovering students' learning interests through conversational AI. This feature helps create personalized learning threads based on students' expressed interests and passions.

## Current Implementation

### Features
- **Chat Interface**: Text-based conversation with an AI assistant
- **Interest Detection**: Automatically identifies and tracks learning interests mentioned in conversation
- **Real-time Updates**: Live transcript display with chat bubbles
- **Interest Tracking**: Visual display of detected interests with confidence scores
- **Mock Server Support**: Fully functional with the local mock server for development

### Technical Details

#### Frontend Components
- `VoiceInterviewPage.tsx`: Main component handling the interview interface
- Chat UI with send button and keyboard support (Enter to send)
- Interest sidebar showing detected topics
- Session management and polling for updates

#### API Endpoints Used
- `POST /api/interview/start`: Start a new interview session
- `POST /api/interview/:sessionId/message`: Send messages during interview
- `GET /api/interview/:sessionId/status`: Check session status

#### Interest Categories
- **Career**: Mathematics, Science, Physics, Chemistry, Biology, Computer Science
- **Personal**: History, Visual Arts, Music, Creative Arts, Languages, Literature, Sports & Fitness
- **Social**: Environmental Studies
- **Philanthropic**: Community Service

## Running Locally

### Start the Mock Server
```bash
npm run dev:mock
```
This starts the mock server on `http://localhost:8000`

### Start the Frontend
```bash
npm run dev
```
This starts the Vite dev server on `http://localhost:5173`

### Access the Feature
1. Navigate to the dashboard
2. Click on "Discover Learning Threads" or go to `/voice-interview`
3. Click "Start Interview" to begin
4. Type messages about your interests
5. Watch as interests are detected and displayed in real-time

## Development Notes

### Mock Server Responses
The mock server provides contextual responses based on keywords:
- Mentions of "math" trigger mathematics-related follow-up questions
- Mentions of "science" trigger science exploration questions
- Similar patterns for history, programming, art, music, languages, etc.

### WebRTC Support (Future)
The component includes WebRTC scaffolding for future voice support:
- Peer connection setup
- ICE candidate handling
- Audio stream management
- Mute/unmute functionality

Currently, WebRTC is disabled in favor of the text chat interface for stability.

### Environment Variables
- `VITE_API_BASE_URL`: Points to the API server (use `.env.local` for local development)
- `VITE_ENABLE_VOICE_INTERVIEW`: Feature flag (currently always true)
- `VITE_WEBRTC_SIGNAL_SERVER`: WebRTC signaling server URL (for future use)

## Testing the Feature

### Basic Flow
1. Start interview session
2. Type "I love mathematics and science"
3. Observe that Mathematics and Science appear in the interests sidebar
4. Continue conversation to discover more interests
5. End interview when done

### Edge Cases to Test
- Empty messages (should be prevented)
- Rapid message sending (handled with loading state)
- Network errors (shows toast notifications)
- Session timeout (handled by polling)

## Future Enhancements

### Voice Support
- Enable WebRTC for actual voice conversations
- Add speech-to-text transcription
- Implement real-time audio streaming

### AI Improvements
- Better interest detection algorithms
- Contextual conversation flow
- Personalized follow-up questions
- Integration with actual AI/LLM service

### UI/UX Enhancements
- Voice activity indicators
- Typing indicators
- Better mobile responsiveness
- Interview progress tracking
- Export interview results

### Backend Integration
- Real interview session management
- Persistent interest storage
- Integration with learning path generation
- Analytics and insights

## Troubleshooting

### Common Issues
1. **"Interview service not available"**: Make sure the mock server is running on port 8000
2. **Network errors**: Check that both frontend and mock server are running
3. **No interests detected**: Make sure to mention specific subjects in your messages

### Debug Mode
The component includes console logs for debugging:
- Session creation
- Message sending
- Status polling
- Error details

Check the browser console for detailed information during development.
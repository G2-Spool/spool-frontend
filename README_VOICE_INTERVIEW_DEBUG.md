# Voice Interview Debugging Guide

## Overview
This document provides debugging information for the voice interview feature in the Spool Frontend application.

## Architecture
- **InterviewModal**: Text-based chat interface with a "Rather talk?" button
- **VoiceInterviewPage**: WebRTC-based voice interview implementation
- **API Endpoints**: Uses `/api/interview/*` endpoints for both text and voice

## Key Changes Made

### 1. Enhanced Debug Logging
- Added emoji-based console logging for better visibility
- Environment configuration logging at startup
- Detailed error messages with specific HTTP status codes
- WebRTC connection state monitoring

### 2. Voice Button Implementation
- Added "Rather talk?" button to InterviewModal
- Button navigates to `/interview` route (VoiceInterviewPage)
- Styled with teal color scheme to match design

### 3. WebRTC Enhancements
- Better ICE candidate handling with error recovery
- Connection state listeners for debugging
- Specific error messages for microphone permissions
- Enhanced error handling for network issues

## Common Issues & Solutions

### Issue 1: "Interview service not found" (404 Error)
**Cause**: Backend API not running or incorrect endpoint
**Solution**: 
- Ensure backend is running on the configured port
- Check VITE_API_BASE_URL in .env file
- Verify API Gateway configuration if using AWS

### Issue 2: "Network error" 
**Cause**: CORS issues or network connectivity
**Solution**:
- Check backend CORS configuration
- Ensure API allows requests from frontend origin
- Verify network connectivity

### Issue 3: Microphone Permission Denied
**Cause**: Browser blocked microphone access
**Solution**:
- Click the microphone icon in browser address bar
- Allow microphone permissions for the site
- Refresh and try again

### Issue 4: WebRTC Connection Failed
**Cause**: ICE server configuration or firewall
**Solution**:
- Check ICE server configuration in backend
- Ensure TURN servers are configured for restrictive networks
- Check firewall settings

## Environment Configuration

### Required Environment Variables
```bash
VITE_API_BASE_URL=https://your-api-gateway.amazonaws.com/prod
VITE_WEBRTC_SIGNAL_SERVER=wss://your-websocket-server
VITE_ENABLE_VOICE_INTERVIEW=true
```

### Local Development
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WEBRTC_SIGNAL_SERVER=ws://localhost:8001
```

## Testing Checklist

1. **Text Interview Flow**
   - [ ] Click "New Thread" on dashboard
   - [ ] Modal opens with text chat
   - [ ] Can send messages and receive responses
   - [ ] Interests are extracted and saved

2. **Voice Interview Flow**
   - [ ] Click "Rather talk?" button in modal
   - [ ] Navigates to voice interview page
   - [ ] Microphone permission requested
   - [ ] WebRTC connection established
   - [ ] Can speak and hear responses
   - [ ] Transcript updates in real-time

3. **Error Handling**
   - [ ] Graceful handling of network errors
   - [ ] Clear error messages for users
   - [ ] Proper cleanup on page navigation

## Debug Commands

### Check Console Logs
Open browser developer tools and filter console by:
- 🎯 - Interview start/navigation events
- 📡 - API calls
- 🌐 - WebRTC setup
- ❌ - Errors
- ✅ - Success events

### Monitor Network Traffic
1. Open Network tab in developer tools
2. Look for:
   - `/api/interview/start` - Interview initialization
   - `/api/interview/*/ice-servers` - ICE server configuration
   - WebSocket connections for signaling

### WebRTC Internals
Chrome: `chrome://webrtc-internals/`
Firefox: `about:webrtc`

## Next Steps
1. Ensure backend WebRTC signaling server is running
2. Configure TURN servers for production
3. Add voice activity detection (VAD)
4. Implement automatic reconnection logic
5. Add visual feedback for voice levels
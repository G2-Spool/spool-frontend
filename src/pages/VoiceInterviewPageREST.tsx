import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { ChatBubble } from '../components/molecules/ChatBubble';
import { InterestBubble } from '../components/molecules/InterestBubble';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

interface TranscriptEntry {
  speaker: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface RTCEndpoints {
  offer: string;
  answer: string;
  ice_candidate: string;
}

const VoiceInterviewPageREST: React.FC = () => {
  const { user } = useAuth();
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [rtcEndpoints, setRtcEndpoints] = useState<RTCEndpoints | null>(null);
  const [status, setStatus] = useState<string>('Ready to start');
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when transcript updates
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const startInterview = async () => {
    try {
      setStatus('Starting interview...');
      
      // Start interview session
      const response = await api.post('/api/interview/start', { user_id: user?.sub || 'anonymous' });
      const { session_id, rtc_endpoints } = response.data;
      
      setSessionId(session_id);
      setRtcEndpoints(rtc_endpoints);
      setIsInterviewing(true);
      setStatus('Initializing audio...');
      
      // Get ICE servers including TURN credentials
      const iceResponse = await api.get(`/api/interview/${session_id}/ice-servers`);
      const { iceServers } = iceResponse.data;
      
      // Setup WebRTC
      await setupWebRTC(session_id, rtc_endpoints, iceServers);
      
      // Get initial status
      const statusResponse = await api.get(`/api/interview/${session_id}/status`);
      if (statusResponse.data.greeting) {
        setTranscript([{
          speaker: 'assistant',
          text: statusResponse.data.greeting,
          timestamp: new Date().toISOString()
        }]);
      }
      
      setStatus('Connected! You can start speaking.');
    } catch (error) {
      console.error('Failed to start interview:', error);
      setStatus('Failed to start interview. Please try again.');
      setIsInterviewing(false);
    }
  };

  const setupWebRTC = async (sessionId: string, endpoints: RTCEndpoints, iceServers: RTCIceServer[]) => {
    try {
      // Create peer connection with ICE servers
      const pc = new RTCPeerConnection({
        iceServers,
        iceCandidatePoolSize: 10,
      });
      
      peerConnectionRef.current = pc;
      
      // Setup event handlers
      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          // Send ICE candidate to server
          await api.post(endpoints.ice_candidate, {
            candidate: event.candidate
          });
        }
      };
      
      pc.ontrack = (event) => {
        // Handle incoming audio from assistant
        if (audioRef.current && event.streams[0]) {
          remoteStreamRef.current = event.streams[0];
          audioRef.current.srcObject = event.streams[0];
          audioRef.current.play().catch(e => console.error('Audio play error:', e));
        }
      };
      
      pc.onconnectionstatechange = () => {
        setStatus(`Connection: ${pc.connectionState}`);
        console.log('Connection state:', pc.connectionState);
      };
      
      // Get user media (microphone)
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false 
      });
      
      localStreamRef.current = stream;
      
      // Add audio track to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
      
      // Create offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });
      
      await pc.setLocalDescription(offer);
      
      // Send offer to server and get answer
      const response = await api.post(endpoints.offer, {
        sdp: offer.sdp,
        type: offer.type
      });
      
      const answer = response.data;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      
      // Start polling for transcript updates
      startTranscriptPolling(sessionId);
      
    } catch (error) {
      console.error('WebRTC setup failed:', error);
      throw error;
    }
  };

  const startTranscriptPolling = (sessionId: string) => {
    // Poll for transcript updates every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get(`/api/interview/${sessionId}/status`);
        
        // Check for new interests
        if (response.data.interests_detected > interests.length) {
          // Fetch full results to get new interests
          const resultsResponse = await api.get(`/api/interview/${sessionId}/results`);
          const newInterests = resultsResponse.data.interests.map((i: any) => i.name);
          setInterests(newInterests);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);
    
    // Store interval ID for cleanup
    (window as any).transcriptPollInterval = pollInterval;
  };

  const endInterview = async () => {
    try {
      setStatus('Ending interview...');
      
      // Stop polling
      if ((window as any).transcriptPollInterval) {
        clearInterval((window as any).transcriptPollInterval);
      }
      
      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
      
      // Stop local stream
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      
      // End session on server
      if (sessionId) {
        await api.post(`/api/interview/${sessionId}/end`);
      }
      
      setIsInterviewing(false);
      setStatus('Interview completed!');
    } catch (error) {
      console.error('Failed to end interview:', error);
      setStatus('Error ending interview');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Voice Interview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Interview Area */}
          <div className="md:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Interview Chat</h2>
                <p className="text-sm text-gray-600 mt-1">{status}</p>
              </div>
              
              {/* Transcript Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {transcript.map((entry, index) => (
                  <ChatBubble
                    key={index}
                    message={entry.text}
                    isUser={entry.speaker === 'user'}
                    timestamp={new Date(entry.timestamp).toLocaleTimeString()}
                  />
                ))}
                <div ref={transcriptEndRef} />
              </div>
              
              {/* Controls */}
              <div className="p-4 border-t">
                {!isInterviewing ? (
                  <Button
                    onClick={startInterview}
                    className="w-full"
                    variant="primary"
                  >
                    Start Voice Interview
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-600">Recording...</span>
                    </div>
                    <Button
                      onClick={endInterview}
                      className="w-full"
                      variant="secondary"
                    >
                      End Interview
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
          
          {/* Interests Sidebar */}
          <div>
            <Card className="h-[600px] flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Detected Interests</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {interests.length} interest{interests.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {interests.length === 0 ? (
                  <p className="text-gray-500 text-center mt-8">
                    Interests will appear here as they are detected during the conversation
                  </p>
                ) : (
                  <div className="space-y-2">
                    {interests.map((interest, index) => (
                      <InterestBubble key={index} interest={interest} />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
        
        {/* Hidden audio element for playback */}
        <audio ref={audioRef} className="hidden" />
      </div>
    </div>
  );
};

export default VoiceInterviewPageREST;
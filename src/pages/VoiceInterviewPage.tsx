import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Card } from '../components/atoms/Card';
import { ChatBubble } from '../components/molecules/ChatBubble';
import { InterestBubble } from '../components/molecules/InterestBubble';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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

interface DetectedInterest {
  name: string;
  category: 'personal' | 'social' | 'career' | 'philanthropic';
  confidence: number;
}

export const VoiceInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isInterviewing, setIsInterviewing] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [detectedInterests, setDetectedInterests] = useState<DetectedInterest[]>([]);
  const [, setRtcEndpoints] = useState<RTCEndpoints | null>(null);
  const [status, setStatus] = useState<string>('Ready to discover your learning threads');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Scroll to bottom when transcript updates
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      cleanup();
    };
  }, []);

  const startInterview = async () => {
    try {
      setIsConnecting(true);
      setStatus('Starting your thread discovery interview...');
      
      // Start interview session
      const response = await api.post<{ session_id: string; rtc_endpoints: RTCEndpoints }>(
        '/api/interview/start', 
        { user_id: user?.id || 'anonymous' }
      );
      const { session_id, rtc_endpoints } = response;
      
      setSessionId(session_id);
      setRtcEndpoints(rtc_endpoints);
      setStatus('Initializing audio connection...');
      
      // Get ICE servers including TURN credentials
      const iceResponse = await api.get<{ iceServers: RTCIceServer[] }>(
        `/api/interview/${session_id}/ice-servers`
      );
      const { iceServers } = iceResponse;
      
      // Setup WebRTC
      await setupWebRTC(session_id, rtc_endpoints, iceServers);
      
      // Get initial greeting
      const statusResponse = await api.get<{ greeting?: string }>(
        `/api/interview/${session_id}/status`
      );
      if (statusResponse.greeting) {
        setTranscript([{
          speaker: 'assistant',
          text: statusResponse.greeting,
          timestamp: new Date().toISOString()
        }]);
      }
      
      setIsInterviewing(true);
      setIsConnecting(false);
      setStatus('Connected! Let\'s discover your interests together.');
    } catch (error) {
      console.error('Failed to start interview:', error);
      setStatus('Failed to start interview. Please check your microphone and try again.');
      setIsConnecting(false);
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
        const state = pc.connectionState;
        if (state === 'connected') {
          setStatus('Connected! You can start speaking.');
        } else if (state === 'failed' || state === 'disconnected') {
          setStatus(`Connection ${state}. Please refresh and try again.`);
        }
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
      
      // Setup audio level monitoring
      setupAudioLevelMonitoring(stream);
      
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
      const response = await api.post<RTCSessionDescriptionInit>(endpoints.offer, {
        sdp: offer.sdp,
        type: offer.type
      });
      
      const answer = response;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      
      // Start polling for updates
      startPolling(sessionId);
      
    } catch (error) {
      console.error('WebRTC setup failed:', error);
      throw error;
    }
  };

  const setupAudioLevelMonitoring = (stream: MediaStream) => {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    scriptProcessor.onaudioprocess = () => {
      const array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      const average = array.reduce((a, b) => a + b) / array.length;
      setAudioLevel(average);
    };

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
  };

  const startPolling = (sessionId: string) => {
    // Poll for updates every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await api.get<{ 
          interests_detected: number;
          transcript?: TranscriptEntry[];
        }>(`/api/interview/${sessionId}/status`);
        
        // Update transcript if provided
        if (response.transcript && response.transcript.length > transcript.length) {
          setTranscript(response.transcript);
        }
        
        // Check for new interests
        if (response.interests_detected > detectedInterests.length) {
          // Fetch full results to get new interests
          const resultsResponse = await api.get<{ 
            interests: DetectedInterest[] 
          }>(`/api/interview/${sessionId}/results`);
          setDetectedInterests(resultsResponse.interests);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);
    
    pollIntervalRef.current = pollInterval;
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const cleanup = () => {
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
    
    // Clean up audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const endInterview = async () => {
    try {
      setStatus('Wrapping up your interview...');
      
      // Stop polling
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      // End session on server
      if (sessionId) {
        await api.post(`/api/interview/${sessionId}/end`);
      }
      
      cleanup();
      
      setIsInterviewing(false);
      setStatus('Interview completed! Your learning threads have been discovered.');
      
      // Navigate back to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Failed to end interview:', error);
      setStatus('Error ending interview');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-obsidian dark:text-gray-100 mb-2">
              Discover Your Learning Threads
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Let's have a conversation about your interests and passions
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Interview Area */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100">
                      Voice Conversation
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{status}</p>
                  </div>
                  {isInterviewing && (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-gray-500" />
                        <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-teal-500 transition-all duration-75"
                            style={{ width: `${Math.min(audioLevel / 128 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <Button
                        variant={isMuted ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={toggleMute}
                        className={isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : ''}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Transcript Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {transcript.length === 0 && !isInterviewing ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <Sparkles className="h-12 w-12 text-teal-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ready to start your journey?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md">
                      Click "Start Interview" below to begin a conversation about your interests. 
                      This will help us create personalized learning threads just for you.
                    </p>
                  </div>
                ) : (
                  <>
                    {transcript.map((entry, index) => (
                      <ChatBubble
                        key={index}
                        message={entry.text}
                        sender={entry.speaker === 'user' ? 'student' : 'ai'}
                        timestamp={new Date(entry.timestamp)}
                      />
                    ))}
                    <div ref={transcriptEndRef} />
                  </>
                )}
              </div>
              
              {/* Controls */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                {!isInterviewing ? (
                  <Button
                    onClick={startInterview}
                    className="w-full"
                    variant="primary"
                    size="lg"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2" />
                        Start Interview
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Interview in progress
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={endInterview}
                      className="w-full"
                      variant="secondary"
                      size="lg"
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
            <Card className="h-[600px] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-obsidian dark:text-gray-100">
                  Discovered Interests
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {detectedInterests.length} thread{detectedInterests.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {detectedInterests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <AlertCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Your interests will appear here as we discover them during our conversation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {detectedInterests.map((interest, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <InterestBubble
                            interest={interest.name}
                            category={interest.category}
                            strength={interest.confidence}
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {Math.round(interest.confidence * 100)}% confidence
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Tips */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  💡 Interview Tips
                </h3>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Speak naturally about what you enjoy</li>
                  <li>• Share specific examples and stories</li>
                  <li>• Don't worry about "right" answers</li>
                </ul>
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
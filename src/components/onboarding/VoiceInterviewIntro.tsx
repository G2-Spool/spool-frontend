import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Headphones, MessageCircle, Shield, ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useNavigate } from 'react-router-dom';

interface VoiceInterviewIntroProps {
  onNext: () => void;
  onUpdate: (data: any) => void;
  data: any;
}

export function VoiceInterviewIntro({ onNext, onUpdate, data }: VoiceInterviewIntroProps) {
  const navigate = useNavigate();
  const [preferVoice, setPreferVoice] = useState(true);

  const handleStartVoiceInterview = async () => {
    // Check for microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      // Navigate to voice interview page
      navigate('/voice-interview', { 
        state: { 
          fromOnboarding: true,
          profileData: data.profileData 
        } 
      });
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPreferVoice(false);
    }
  };

  const handleSkipToTextInterview = () => {
    onUpdate({ voiceInterviewCompleted: false });
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
          <Mic className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Let's Have a Conversation About Your Interests
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The best way for us to personalize your learning is through a natural conversation. 
          Our AI assistant will chat with you about what you love to do.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">How the Voice Interview Works:</h3>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Natural Conversation</h4>
              <p className="text-sm text-gray-600">
                Our AI will ask you friendly questions about your hobbies, interests, and dreams. 
                Just speak naturally - it's like talking to a friend!
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Headphones className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">5-7 Minutes</h4>
              <p className="text-sm text-gray-600">
                The conversation typically takes 5-7 minutes. You'll see a real-time transcript 
                and can pause anytime if needed.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Privacy Protected</h4>
              <p className="text-sm text-gray-600">
                Your conversation is processed in real-time and only your interests are saved. 
                No audio recordings are stored.
              </p>
            </div>
          </div>
        </div>
      </div>

      {preferVoice ? (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Mic className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Microphone Required</p>
                <p className="text-sm text-amber-700">
                  You'll need to allow microphone access when prompted. Make sure you're in a 
                  quiet environment for the best experience.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleStartVoiceInterview}
              size="lg"
              className="flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              Start Voice Interview
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setPreferVoice(false)}
              size="lg"
            >
              I Prefer Text
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <MicOff className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800 font-medium">Text Interview Available</p>
                <p className="text-sm text-blue-700">
                  No problem! You can share your interests through a text-based survey instead. 
                  It's just as effective for personalizing your experience.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleSkipToTextInterview}
              size="lg"
              className="flex items-center gap-2"
            >
              Continue with Text Interview
              <ArrowRight className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => setPreferVoice(true)}
              size="lg"
            >
              Try Voice Instead
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
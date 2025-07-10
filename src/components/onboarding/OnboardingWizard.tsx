import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Mic, BookOpen, Trophy, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { OnboardingWelcome } from './OnboardingWelcome';
import { InterestDiscovery } from './InterestDiscovery';
import { VoiceInterviewIntro } from './VoiceInterviewIntro';
import { ProfileSetup } from './ProfileSetup';
import { ProductTour } from './ProductTour';
import { Button } from '../atoms/Button';
import { ProgressBar } from '../molecules/ProgressBar';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

interface OnboardingStep {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  icon: React.ElementType;
}

const steps: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome', component: OnboardingWelcome, icon: BookOpen },
  { id: 'profile', title: 'Profile Setup', component: ProfileSetup, icon: Users },
  { id: 'voice-intro', title: 'Voice Interview', component: VoiceInterviewIntro, icon: Mic },
  { id: 'interests', title: 'Interest Discovery', component: InterestDiscovery, icon: Check },
  { id: 'tour', title: 'Product Tour', component: ProductTour, icon: Trophy },
];

export function OnboardingWizard() {
  const navigate = useNavigate();
  const { user, refetchUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    profileData: {},
    voiceInterviewCompleted: false,
    interests: [],
    tourCompleted: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  useEffect(() => {
    // Check if user has already completed onboarding
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data } = await api.get('/api/student-profile');
      if (data.profile && data.profile.interests && data.profile.interests.length > 0) {
        // User has completed onboarding
        navigate('/dashboard');
      }
    } catch (error) {
      // Profile doesn't exist yet, continue with onboarding
      console.log('Starting onboarding for new user');
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateOnboardingData = (stepData: any) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const completeOnboarding = async () => {
    setIsLoading(true);
    try {
      // Save profile data
      await api.put('/api/student-profile', {
        ...onboardingData.profileData,
        interests: onboardingData.interests,
        hasCompletedOnboarding: true,
      });

      // Mark onboarding as complete
      await api.post('/api/onboarding/complete', {
        completedAt: new Date().toISOString(),
        milestones: {
          voiceInterview: onboardingData.voiceInterviewCompleted,
          profileSetup: true,
          interestDiscovery: true,
          productTour: onboardingData.tourCompleted,
        },
      });

      toast.success('Welcome to Spool! Your personalized learning journey begins now.');
      await refetchUser();
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const skipToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome to Spool</h1>
            <div className="text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>
          <ProgressBar value={progress} className="mb-4" />
          
          {/* Step indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => skipToStep(index)}
                  disabled={index > currentStep}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-teal-50 text-teal-700 font-medium' 
                      : isCompleted
                      ? 'text-teal-600 hover:bg-gray-50 cursor-pointer'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStepComponent 
                onNext={handleNext}
                onUpdate={updateOnboardingData}
                data={onboardingData}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Complete Setup
                <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
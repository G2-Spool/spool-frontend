import { motion } from 'framer-motion';
import { Play, Sparkles, Brain, Heart } from 'lucide-react';
import { Button } from '../atoms/Button';

interface OnboardingWelcomeProps {
  onNext: () => void;
}

export function OnboardingWelcome({ onNext }: OnboardingWelcomeProps) {
  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 rounded-full mb-6">
          <Sparkles className="w-12 h-12 text-teal-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your Personalized Learning Journey
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Spool transforms education by making every lesson personally relevant to you. 
          We'll start by getting to know what excites and interests you.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <Brain className="w-10 h-10 text-teal-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Personalization</h3>
          <p className="text-sm text-gray-600">
            Every concept is tailored to your interests, making learning naturally engaging
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <Heart className="w-10 h-10 text-teal-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Connect to Your Life</h3>
          <p className="text-sm text-gray-600">
            See how each lesson relates to your personal, social, career, and philanthropic goals
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <Play className="w-10 h-10 text-teal-600 mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">Learn Through Conversation</h3>
          <p className="text-sm text-gray-600">
            Share your interests through a natural voice conversation, not boring forms
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="space-y-4"
      >
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-teal-800">
            <strong>🎯 What's Next:</strong> We'll set up your profile and then have a 
            friendly conversation about your interests. This helps us personalize every 
            aspect of your learning experience.
          </p>
        </div>

        <Button onClick={onNext} size="lg" className="min-w-[200px]">
          Let's Get Started
        </Button>
      </motion.div>
    </div>
  );
}
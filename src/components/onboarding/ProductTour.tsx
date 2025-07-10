import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Mic, Brain, Trophy, Users, ChevronLeft, 
  ChevronRight, CheckCircle, Play 
} from 'lucide-react';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';

interface ProductTourProps {
  onNext: () => void;
  onUpdate: (data: any) => void;
  data: any;
}

interface TourSegment {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  demo: React.ReactNode;
  features: string[];
}

const tourSegments: TourSegment[] = [
  {
    id: 'voice-interview',
    title: 'Voice Interview Demo',
    description: 'Experience how we discover your interests through natural conversation',
    icon: Mic,
    demo: (
      <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-gray-400">Recording...</span>
        </div>
        <div className="space-y-2">
          <div className="bg-blue-600 rounded-lg p-2 max-w-[80%]">
            AI: "What do you love doing when you have free time?"
          </div>
          <div className="bg-green-600 rounded-lg p-2 max-w-[80%] ml-auto">
            You: "I love playing Minecraft and building automated farms!"
          </div>
          <div className="bg-blue-600 rounded-lg p-2 max-w-[80%]">
            AI: "That's awesome! What do you enjoy most about it?"
          </div>
        </div>
      </div>
    ),
    features: [
      'Natural conversation, not boring forms',
      'AI understands context and asks follow-ups',
      'Real-time transcript for transparency',
      '5-7 minute friendly chat',
    ],
  },
  {
    id: 'concept-display',
    title: 'Concept Display Preview',
    description: 'See how every lesson connects to your personal interests',
    icon: BookOpen,
    demo: (
      <div className="space-y-3">
        <div className="text-sm font-semibold text-gray-700 mb-2">
          Learning: Iteration in Programming
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-3 border-t-4 border-purple-500">
            <p className="text-xs font-medium text-purple-600 mb-1">Personal</p>
            <p className="text-xs">Like grinding XP in your favorite RPG...</p>
          </Card>
          <Card className="p-3 border-t-4 border-yellow-500">
            <p className="text-xs font-medium text-yellow-600 mb-1">Social</p>
            <p className="text-xs">When your Minecraft server runs events...</p>
          </Card>
          <Card className="p-3 border-t-4 border-teal-500">
            <p className="text-xs font-medium text-teal-600 mb-1">Career</p>
            <p className="text-xs">Game developers use iteration to...</p>
          </Card>
          <Card className="p-3 border-t-4 border-red-500">
            <p className="text-xs font-medium text-red-600 mb-1">Philanthropic</p>
            <p className="text-xs">Optimizing code saves energy...</p>
          </Card>
        </div>
      </div>
    ),
    features: [
      'Four life-category connections for every concept',
      'Examples using YOUR specific interests',
      'Visual aids and interactive elements',
      'Makes abstract concepts personally relevant',
    ],
  },
  {
    id: 'exercise-system',
    title: 'Exercise System Walkthrough',
    description: 'Understand how we verify true mastery through articulation',
    icon: Brain,
    demo: (
      <div className="space-y-3">
        <Card className="p-3 bg-teal-50 border-teal-200">
          <p className="text-xs font-medium text-teal-700 mb-1">Your Exercise:</p>
          <p className="text-xs text-gray-700">
            "Your Minecraft clan wants to automate wheat farming. Design a system 
            that plants and harvests 100 wheat every hour. Explain your step-by-step approach."
          </p>
        </Card>
        <div className="bg-gray-100 rounded p-3">
          <p className="text-xs font-medium text-gray-700 mb-1">Your Response:</p>
          <p className="text-xs text-gray-600 italic">
            "First, I'd calculate the growth time... Then set up water channels..."
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="success" size="sm">✓ Calculation step</Badge>
          <Badge variant="warning" size="sm">⚠ Missing efficiency</Badge>
        </div>
      </div>
    ),
    features: [
      'Exercises use YOUR interests as context',
      'Explain your thinking, not just the answer',
      'AI evaluates each logical step',
      'Targeted help for any gaps',
    ],
  },
  {
    id: 'progress-tracking',
    title: 'Progress Visualization',
    description: 'Track your journey with engaging visuals and achievements',
    icon: Trophy,
    demo: (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Math Progress</span>
          <span className="text-sm text-gray-600">45%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-teal-500 h-2 rounded-full" style={{ width: '45%' }} />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-teal-600">7</div>
            <p className="text-xs text-gray-600">Day Streak</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">250</div>
            <p className="text-xs text-gray-600">Points</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <p className="text-xs text-gray-600">Badges</p>
          </div>
        </div>
      </div>
    ),
    features: [
      'Visual learning paths show your journey',
      'Earn points and badges for achievements',
      'Track streaks to build consistency',
      'See detailed competency evidence',
    ],
  },
  {
    id: 'parent-dashboard',
    title: 'Parent Dashboard',
    description: 'Complete visibility into learning progress and mastery',
    icon: Users,
    demo: (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <span className="text-xs font-medium">Sarah Martinez</span>
          <Badge variant="success" size="sm">Active Today</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white p-2 rounded border">
            <p className="text-gray-600">This Week</p>
            <p className="font-semibold">4.5 hours</p>
          </div>
          <div className="bg-white p-2 rounded border">
            <p className="text-gray-600">Mastered</p>
            <p className="font-semibold">12 concepts</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="w-full text-xs">
          View Detailed Progress Report
        </Button>
      </div>
    ),
    features: [
      'Real-time progress updates',
      'Evidence of concept mastery',
      'Time spent learning',
      'Weekly progress reports',
    ],
  },
];

export function ProductTour({ onNext, onUpdate }: ProductTourProps) {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<string[]>([]);

  const segment = tourSegments[currentSegment];
  const SegmentIcon = segment.icon;

  const handleNext = () => {
    if (!completedSegments.includes(segment.id)) {
      setCompletedSegments([...completedSegments, segment.id]);
    }

    if (currentSegment < tourSegments.length - 1) {
      setCurrentSegment(currentSegment + 1);
    } else {
      onUpdate({ tourCompleted: true });
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentSegment > 0) {
      setCurrentSegment(currentSegment - 1);
    }
  };

  const goToSegment = (index: number) => {
    setCurrentSegment(index);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Segment Navigation */}
      <div className="flex justify-center gap-2 mb-8">
        {tourSegments.map((seg, index) => {
          const Icon = seg.icon;
          const isActive = index === currentSegment;
          const isCompleted = completedSegments.includes(seg.id);
          
          return (
            <button
              key={seg.id}
              onClick={() => goToSegment(index)}
              className={`p-2 rounded-lg transition-all ${
                isActive 
                  ? 'bg-teal-100 text-teal-700' 
                  : isCompleted
                  ? 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {isCompleted && !isActive ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={segment.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left: Information */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                <SegmentIcon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{segment.title}</h3>
                <p className="text-sm text-gray-600">{segment.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {segment.features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{feature}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-teal-50 rounded-lg">
              <p className="text-sm text-teal-800">
                <strong>💡 Pro Tip:</strong> {
                  segment.id === 'voice-interview' ? 'The more you share, the better we can personalize!' :
                  segment.id === 'concept-display' ? 'Every lesson starts with YOUR interests!' :
                  segment.id === 'exercise-system' ? 'Focus on explaining your thinking process!' :
                  segment.id === 'progress-tracking' ? 'Small daily sessions build lasting knowledge!' :
                  'Parents can support without micromanaging!'
                }
              </p>
            </div>
          </div>

          {/* Right: Interactive Demo */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Interactive Demo</h4>
                <Badge variant="primary" size="sm">
                  <Play className="w-3 h-3 mr-1" />
                  Live Preview
                </Badge>
              </div>
              
              {segment.demo}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSegment === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {tourSegments.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSegment 
                  ? 'w-8 bg-teal-500' 
                  : completedSegments.includes(tourSegments[index].id)
                  ? 'bg-green-400'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentSegment === tourSegments.length - 1 ? (
            <>
              Start Learning
              <CheckCircle className="w-4 h-4" />
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
  );
}
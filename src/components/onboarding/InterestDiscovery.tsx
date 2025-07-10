import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Hash, Sparkles, Heart, Briefcase, Globe } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Badge } from '../atoms/Badge';
import toast from 'react-hot-toast';

interface InterestDiscoveryProps {
  onNext: () => void;
  onUpdate: (data: any) => void;
  data: any;
}

interface Interest {
  interest: string;
  category: 'personal' | 'social' | 'career' | 'philanthropic';
  strength: number;
}

const categoryIcons = {
  personal: Heart,
  social: Hash,
  career: Briefcase,
  philanthropic: Globe,
};

const categoryColors = {
  personal: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  social: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
  career: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20',
  philanthropic: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
};

const interestSuggestions = {
  personal: ['Gaming', 'Reading', 'Art', 'Music', 'Sports', 'Cooking', 'Photography', 'Dancing'],
  social: ['YouTube', 'TikTok', 'Instagram', 'Discord', 'Clubs', 'Team Sports', 'Theater', 'Volunteering'],
  career: ['Technology', 'Science', 'Business', 'Medicine', 'Teaching', 'Engineering', 'Design', 'Writing'],
  philanthropic: ['Environment', 'Animals', 'Education', 'Health', 'Community', 'Arts', 'Poverty', 'Human Rights'],
};

export function InterestDiscovery({ onNext, onUpdate, data }: InterestDiscoveryProps) {
  const [interests, setInterests] = useState<Interest[]>(
    data.interests || []
  );
  const [currentInput, setCurrentInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Interest['category']>('personal');

  const addInterest = (interest: string) => {
    if (!interest.trim()) return;

    if (interests.some(i => i.interest.toLowerCase() === interest.toLowerCase())) {
      toast.error('You already added this interest');
      return;
    }

    const newInterest: Interest = {
      interest: interest.trim(),
      category: selectedCategory,
      strength: 0.8,
    };

    setInterests([...interests, newInterest]);
    setCurrentInput('');
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (interests.length < 5) {
      toast.error('Please add at least 5 interests to continue');
      return;
    }

    onUpdate({ interests });
    onNext();
  };

  const getCategoryCount = (category: Interest['category']) => {
    return interests.filter(i => i.category === category).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full mb-4">
          <Sparkles className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Tell Us What You Love
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {data.voiceInterviewCompleted 
            ? "Great conversation! Here are the interests we discovered. Feel free to add more!"
            : "Share your interests, hobbies, and passions. We'll use these to personalize every lesson."}
        </p>
      </div>

      {/* Category Selector */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select a life category:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(Object.keys(categoryIcons) as Array<Interest['category']>).map(category => {
            const Icon = categoryIcons[category];
            const count = getCategoryCount(category);
            
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedCategory === category
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 mx-auto ${
                  selectedCategory === category ? 'text-teal-600 dark:text-teal-400' : 'text-gray-600 dark:text-gray-400'
                }`} />
                <p className="text-sm font-medium capitalize">{category}</p>
                {count > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500">{count} added</p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interest Input */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addInterest(currentInput)}
            placeholder={`Add a ${selectedCategory} interest...`}
            className="flex-1"
          />
          <Button
            onClick={() => addInterest(currentInput)}
            disabled={!currentInput.trim()}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Suggestions */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick add suggestions for {selectedCategory}:
        </p>
        <div className="flex flex-wrap gap-2">
          {interestSuggestions[selectedCategory].map(suggestion => (
            <button
              key={suggestion}
              onClick={() => addInterest(suggestion)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full 
                       text-gray-700 dark:text-gray-300 transition-colors"
              disabled={interests.some(i => i.interest === suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Current Interests */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Your Interests ({interests.length})</h3>
          {interests.length < 5 && (
            <p className="text-sm text-amber-600 dark:text-amber-400">Add at least {5 - interests.length} more</p>
          )}
        </div>
        
        {interests.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">No interests added yet. Start adding what you love!</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => {
              const Icon = categoryIcons[interest.category];
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    categoryColors[interest.category]
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{interest.interest}</span>
                  <button
                    onClick={() => removeInterest(index)}
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Balance */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category Balance:</p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {(Object.keys(categoryIcons) as Array<Interest['category']>).map(category => {
            const count = getCategoryCount(category);
            const percentage = interests.length > 0 ? (count / interests.length) * 100 : 0;
            
            return (
              <div key={category}>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{category}</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{count}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                  <div 
                    className="bg-teal-500 h-1 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={interests.length < 5}
          size="lg"
        >
          Continue to Product Tour
        </Button>
      </div>
    </motion.div>
  );
}
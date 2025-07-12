import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Sparkles, TrendingUp, BookOpen, Heart, Loader2 } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { useAddInterest, useGenerateInterestSuggestions } from '../../hooks/useInterests';
import type { Interest, LifeCategory } from '../../types';

interface InterestsDiscoveryProps {
  isOpen: boolean;
  onClose: () => void;
  currentInterests: Interest[];
  onInterestSelected: (interest: Interest) => void;
  onInterestAdded?: (interest: Interest) => void;
}

// Predefined interest suggestions by category
const SUGGESTED_INTERESTS = {
  personal: [
    'Philosophy', 'Psychology', 'Mindfulness', 'Creative Writing', 'Photography',
    'Cooking', 'Fitness', 'Music', 'Art History', 'Literature', 'Languages',
    'Astronomy', 'Neuroscience', 'Self-Improvement', 'Travel', 'Architecture'
  ],
  social: [
    'Cultural Studies', 'Anthropology', 'Sociology', 'Communication',
    'Community Building', 'Social Justice', 'Politics', 'History',
    'Economics', 'Geography', 'International Relations', 'Media Studies',
    'Public Speaking', 'Leadership', 'Team Dynamics', 'Conflict Resolution'
  ],
  career: [
    'Computer Science', 'Data Science', 'Artificial Intelligence', 'Engineering',
    'Business', 'Entrepreneurship', 'Marketing', 'Finance', 'Design',
    'Project Management', 'Research Methods', 'Innovation', 'Technology',
    'Medicine', 'Law', 'Education', 'Journalism', 'Public Policy'
  ],
  philanthropic: [
    'Environmental Science', 'Sustainability', 'Climate Change', 'Conservation',
    'Social Work', 'Human Rights', 'Global Health', 'Education Reform',
    'Poverty Alleviation', 'Community Development', 'Volunteering',
    'Non-Profit Management', 'Ethics', 'Social Entrepreneurship', 'Activism'
  ]
};

const TRENDING_TOPICS = [
  { interest: 'Artificial Intelligence', category: 'career' as LifeCategory },
  { interest: 'Climate Science', category: 'philanthropic' as LifeCategory },
  { interest: 'Mental Health', category: 'personal' as LifeCategory },
  { interest: 'Social Media Psychology', category: 'social' as LifeCategory },
  { interest: 'Sustainable Technology', category: 'career' as LifeCategory },
  { interest: 'Meditation', category: 'personal' as LifeCategory },
  { interest: 'Urban Planning', category: 'social' as LifeCategory },
  { interest: 'Renewable Energy', category: 'philanthropic' as LifeCategory },
];

export const InterestsDiscovery: React.FC<InterestsDiscoveryProps> = ({
  isOpen,
  onClose,
  currentInterests,
  onInterestSelected,
  onInterestAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LifeCategory | 'all'>('all');
  const [customInterest, setCustomInterest] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const addInterestMutation = useAddInterest();
  const generateSuggestionsMutation = useGenerateInterestSuggestions();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setCustomInterest('');
      setShowCustomInput(false);
    }
  }, [isOpen]);

  const currentInterestNames = currentInterests.map(i => i.interest.toLowerCase());

  // Filter suggestions based on search and category
  const getFilteredSuggestions = () => {
    let allSuggestions: Array<{ interest: string; category: LifeCategory }> = [];
    
    if (selectedCategory === 'all') {
      Object.entries(SUGGESTED_INTERESTS).forEach(([category, interests]) => {
        interests.forEach(interest => {
          allSuggestions.push({ interest, category: category as LifeCategory });
        });
      });
    } else {
      SUGGESTED_INTERESTS[selectedCategory].forEach(interest => {
        allSuggestions.push({ interest, category: selectedCategory });
      });
    }

    // Filter out current interests and apply search
    return allSuggestions
      .filter(item => !currentInterestNames.includes(item.interest.toLowerCase()))
      .filter(item => 
        searchQuery === '' || 
        item.interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 12); // Limit to 12 suggestions
  };

  const handleInterestClick = async (interest: string, category: LifeCategory) => {
    try {
      await addInterestMutation.mutateAsync({
        interest,
        category,
        strength: 0.5,
      });
      
      // Also call the callback for immediate UI feedback
      const newInterest: Interest = {
        interest,
        category,
        strength: 0.5,
      };
      onInterestSelected(newInterest);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleCustomInterestAdd = async () => {
    if (customInterest.trim() && selectedCategory !== 'all') {
      try {
        await addInterestMutation.mutateAsync({
          interest: customInterest.trim(),
          category: selectedCategory,
          strength: 0.5,
        });
        
        // Also call the callback for immediate UI feedback
        const newInterest: Interest = {
          interest: customInterest.trim(),
          category: selectedCategory,
          strength: 0.5,
        };
        onInterestSelected(newInterest);
        setCustomInterest('');
        setShowCustomInput(false);
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  };

  const handleGenerateSuggestions = async () => {
    try {
      await generateSuggestionsMutation.mutateAsync(currentInterests);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getCategoryColor = (category: LifeCategory) => {
    switch (category) {
      case 'personal': return 'border-personal text-personal bg-personal/10';
      case 'social': return 'border-social text-social bg-social/10';
      case 'career': return 'border-career text-career bg-career/10';
      case 'philanthropic': return 'border-philanthropic text-philanthropic bg-philanthropic/10';
      default: return 'border-gray-300 text-gray-600 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  const filteredSuggestions = getFilteredSuggestions();
  const trendingFiltered = TRENDING_TOPICS.filter(
    item => !currentInterestNames.includes(item.interest.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-personal/10 rounded-lg">
                <Search className="h-6 w-6 text-personal" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">
                  Discover New Interests
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Explore topics across different areas of life
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full -mr-2 -mt-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search and Category Filter */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for interests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-personal focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === 'all' ? 'primary' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className="cursor-pointer"
              >
                All Categories
              </Badge>
              {Object.keys(SUGGESTED_INTERESTS).map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  onClick={() => setSelectedCategory(category as LifeCategory)}
                  className={`cursor-pointer ${getCategoryColor(category as LifeCategory)}`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          {trendingFiltered.length > 0 && searchQuery === '' && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-obsidian dark:text-gray-100">
                  Trending This Week
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {trendingFiltered.slice(0, 4).map((item, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-all cursor-pointer hover:scale-105"
                    onClick={() => handleInterestClick(item.interest, item.category)}
                  >
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        size="sm"
                        className={`mb-2 ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </Badge>
                      <p className="text-sm font-medium text-obsidian dark:text-gray-100">
                        {item.interest}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Interest Suggestions */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <h3 className="font-semibold text-obsidian dark:text-gray-100">
                  Suggested Interests
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCustomInput(!showCustomInput)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom
              </Button>
            </div>

            {/* Custom Interest Input */}
            {showCustomInput && (
              <Card className="mb-4 bg-gray-50 dark:bg-gray-800">
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-obsidian dark:text-gray-100 mb-2">
                      Add your own interest
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a topic you're curious about..."
                      value={customInterest}
                      onChange={(e) => setCustomInterest(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-personal focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category:</span>
                    <select
                      value={selectedCategory === 'all' ? 'personal' : selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as LifeCategory)}
                      className="px-3 py-1 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-sm"
                    >
                      {Object.keys(SUGGESTED_INTERESTS).map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCustomInterestAdd}
                      disabled={!customInterest.trim() || selectedCategory === 'all' || addInterestMutation.isPending}
                    >
                      {addInterestMutation.isPending ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Adding...
                        </>
                      ) : (
                        'Add Interest'
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Suggestions Grid */}
            {filteredSuggestions.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredSuggestions.map((item, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-all cursor-pointer hover:scale-105"
                    onClick={() => handleInterestClick(item.interest, item.category)}
                  >
                    <div className="text-center">
                      <Badge
                        variant="outline"
                        size="sm"
                        className={`mb-2 ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </Badge>
                      <p className="text-sm font-medium text-obsidian dark:text-gray-100">
                        {item.interest}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : searchQuery !== '' ? (
              <Card className="text-center py-8">
                <Search className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  No interests found for "{searchQuery}"
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Try a different search term or add it as a custom interest
                </p>
              </Card>
            ) : (
              <Card className="text-center py-8">
                <Heart className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">
                  You've explored all interests in this category!
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Try a different category or add a custom interest
                </p>
              </Card>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
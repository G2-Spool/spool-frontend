import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { Plus, Heart, TrendingUp, Star } from 'lucide-react';
import type { Interest } from '../../types';

interface InterestsDisplayProps {
  interests: Interest[];
  onInterestClick?: (interest: Interest) => void;
  onAddInterest?: () => void;
  showCategories?: boolean;
  showStrength?: boolean;
  maxDisplay?: number;
  layout?: 'grid' | 'list' | 'compact';
}

export const InterestsDisplay: React.FC<InterestsDisplayProps> = ({
  interests,
  onInterestClick,
  onAddInterest,
  showCategories = true,
  showStrength = false,
  maxDisplay,
  layout = 'grid',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');

  const filteredInterests = selectedCategory === 'all' 
    ? interests 
    : interests.filter(interest => interest.category === selectedCategory);

  const displayInterests = maxDisplay 
    ? filteredInterests.slice(0, maxDisplay)
    : filteredInterests;

  const categories = Array.from(new Set(interests.map(i => i.category)));

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'text-green-600 dark:text-green-400';
    if (strength >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getStrengthIcon = (strength: number) => {
    if (strength >= 0.8) return <Star className="h-3 w-3" />;
    if (strength >= 0.6) return <TrendingUp className="h-3 w-3" />;
    return <Heart className="h-3 w-3" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'border-personal text-personal bg-personal/10';
      case 'social': return 'border-social text-social bg-social/10';
      case 'career': return 'border-career text-career bg-career/10';
      case 'philanthropic': return 'border-philanthropic text-philanthropic bg-philanthropic/10';
      default: return 'border-gray-300 text-gray-600 bg-gray-50';
    }
  };

  if (interests.length === 0) {
    return (
      <Card className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-obsidian dark:text-gray-100 mb-2">
          No interests yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Start exploring topics that spark your curiosity
        </p>
        {onAddInterest && (
          <Button variant="primary" onClick={onAddInterest}>
            <Plus className="h-4 w-4 mr-2" />
            Discover Interests
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      {showCategories && categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="cursor-pointer"
          >
            All ({interests.length})
          </Badge>
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer ${getCategoryColor(category)}`}
            >
              {category} ({interests.filter(i => i.category === category).length})
            </Badge>
          ))}
        </div>
      )}

      {/* Interests Display */}
      {layout === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayInterests.map((interest, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-all cursor-pointer hover:scale-105"
              onClick={() => onInterestClick?.(interest)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-obsidian dark:text-gray-100 mb-2">
                    {interest.interest}
                  </h3>
                  {showCategories && (
                    <Badge
                      variant="outline"
                      size="sm"
                      className={getCategoryColor(interest.category)}
                    >
                      {interest.category}
                    </Badge>
                  )}
                </div>
                {showStrength && (
                  <div className={`flex items-center gap-1 ${getStrengthColor(interest.strength)}`}>
                    {getStrengthIcon(interest.strength)}
                    <span className="text-xs font-medium">
                      {Math.round(interest.strength * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
          
          {/* Add Interest Card */}
          {onAddInterest && (
            <Card
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary cursor-pointer transition-colors flex items-center justify-center min-h-[120px]"
              onClick={onAddInterest}
            >
              <div className="text-center">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Add New Interest
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {layout === 'list' && (
        <div className="space-y-2">
          {displayInterests.map((interest, index) => (
            <Card
              key={index}
              className="hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onInterestClick?.(interest)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-gray-400" />
                  <span className="font-medium text-obsidian dark:text-gray-100">
                    {interest.interest}
                  </span>
                  {showCategories && (
                    <Badge
                      variant="outline"
                      size="sm"
                      className={getCategoryColor(interest.category)}
                    >
                      {interest.category}
                    </Badge>
                  )}
                </div>
                {showStrength && (
                  <div className={`flex items-center gap-1 ${getStrengthColor(interest.strength)}`}>
                    {getStrengthIcon(interest.strength)}
                    <span className="text-xs font-medium">
                      {Math.round(interest.strength * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {layout === 'compact' && (
        <div className="flex flex-wrap gap-2">
          {displayInterests.map((interest, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onInterestClick?.(interest)}
              className="flex items-center gap-2"
            >
              {interest.interest}
              {showStrength && (
                <span className={`text-xs ${getStrengthColor(interest.strength)}`}>
                  {Math.round(interest.strength * 100)}%
                </span>
              )}
            </Button>
          ))}
          {onAddInterest && (
            <Button
              variant="outline"
              size="sm"
              onClick={onAddInterest}
              className="border-dashed"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add
            </Button>
          )}
        </div>
      )}

      {/* Show more indicator */}
      {maxDisplay && filteredInterests.length > maxDisplay && (
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {maxDisplay} of {filteredInterests.length} interests
          </p>
        </div>
      )}
    </div>
  );
};
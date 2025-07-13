import { Heart, Sparkles, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../atoms/Button';

interface InterestWithDetails {
  interest: string;
  details: string;
  discovered_at: string;
}

interface InterestDetailCardProps {
  interest: InterestWithDetails;
  onExplore?: (interest: string) => void;
}

export function InterestDetailCard({ interest, onExplore }: InterestDetailCardProps) {
  const timeAgo = formatDistanceToNow(new Date(interest.discovered_at), { addSuffix: true });

  // Generate a gradient based on the interest name
  const gradients = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
  ];
  
  const gradientIndex = interest.interest.charCodeAt(0) % gradients.length;
  const selectedGradient = gradients[gradientIndex];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 overflow-hidden">
      {/* Gradient Header */}
      <div className={`h-2 bg-gradient-to-r ${selectedGradient}`} />
      
      <div className="p-6">
        {/* Interest Title */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            {interest.interest}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
        </div>

        {/* Details */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {interest.details}
        </p>

        {/* Action Button */}
        <Button
          variant="primary"
          onClick={() => onExplore?.(interest.interest)}
          className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${selectedGradient} text-white font-medium text-sm hover:opacity-90 transition-opacity`}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          Explore Learning Paths
        </Button>
      </div>
    </div>
  );
} 
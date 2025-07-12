/**
 * Achievement Item Component
 * 
 * Displays an individual achievement with title, timestamp, and colored dot indicator.
 * Used in achievement lists and profile sections.
 */

import React from "react";
import { Badge } from "../atoms/Badge";
import { AchievementDot } from "../atoms/AchievementDot";

interface AchievementItemProps {
  title: string;
  timeAgo: string;
  color?: string;
}

export const AchievementItem: React.FC<AchievementItemProps> = ({ 
  title, 
  timeAgo, 
  color 
}) => {
  return (
    <div className="flex items-center space-x-3">
      <AchievementDot color={color} />
      <span className="text-sm text-gray-300">{title}</span>
      <Badge variant="default" size="sm" className="ml-auto">
        {timeAgo}
      </Badge>
    </div>
  );
};

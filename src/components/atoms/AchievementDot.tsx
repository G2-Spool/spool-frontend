/**
 * Achievement Dot Component
 * 
 * Simple colored dot indicator for achievements.
 * Used in achievement lists and notifications.
 */

import React from 'react';

interface AchievementDotProps {
  color?: string;
}

export const AchievementDot: React.FC<AchievementDotProps> = ({ color = "#78af9f" }) => {
  return <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />;
};

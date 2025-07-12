/**
 * Achievement system for tracking and displaying learning milestones
 * 
 * Manages achievement definitions, checking conditions, and storing unlocked achievements.
 * Adapted for AWS Amplify authentication in spool-frontend.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

// Interface for completion data (matching the study streak interface)
interface ConceptCompletion {
  conceptId: string;
  completedAt: string;
  completedTime?: string;
  topicId: string;
  conceptTitle: string;
}

// Achievement rarity levels for visual styling
export type AchievementRarity = "common" | "uncommon" | "rare" | "legendary";

// Achievement category for organization
export type AchievementCategory = "streak" | "learning" | "consistency" | "mastery";

// Achievement definition interface
export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  condition: string; // Human-readable condition description
}

// Unlocked achievement with timestamp
export interface UnlockedAchievement {
  id: string;
  unlockedAt: string; // ISO timestamp
  definition: AchievementDefinition;
}

// Achievement storage interface
interface AchievementData {
  unlockedAchievements: UnlockedAchievement[];
  lastChecked: string;
}

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // í´¥ Streak Achievements
  {
    id: "first-study-day",
    title: "Learning Journey Begins",
    description: "Completed your first concept",
    icon: "í¼±",
    rarity: "common",
    category: "streak",
    condition: "Complete 1 concept"
  },
  {
    id: "streak-3",
    title: "Getting Started",
    description: "Studied for 3 days in a row",
    icon: "í´¥",
    rarity: "common",
    category: "streak",
    condition: "3-day study streak"
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Maintained a 7-day study streak",
    icon: "âš¡",
    rarity: "uncommon",
    category: "streak",
    condition: "7-day study streak"
  },
  // í³š Learning Milestones
  {
    id: "concept-collector-5",
    title: "Concept Collector",
    description: "Completed 5 concepts",
    icon: "í³",
    rarity: "common",
    category: "learning",
    condition: "Complete 5 concepts total"
  },
  {
    id: "concept-collector-25",
    title: "Knowledge Builder",
    description: "Completed 25 concepts",
    icon: "í· ",
    rarity: "uncommon",
    category: "learning",
    condition: "Complete 25 concepts total"
  }
];

// Helper functions for localStorage keys
const getAchievementStorageKey = (userId?: string) => 
  userId ? `achievement-data-${userId}` : "achievement-data";

const getStudyStreakStorageKey = (userId?: string) => 
  userId ? `study-streak-data-${userId}` : "study-streak-data";

export function useAchievements() {
  const { user } = useAuth();
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<UnlockedAchievement[]>([]);

  // Load achievement data from localStorage
  const loadAchievementData = useCallback((): AchievementData => {
    try {
      const stored = localStorage.getItem(getAchievementStorageKey(user?.id));
      const data = stored ? JSON.parse(stored) : { 
        unlockedAchievements: [], 
        lastChecked: new Date().toISOString() 
      };
      
      // Deduplicate achievements based on ID
      const seen = new Set<string>();
      const deduplicatedAchievements = data.unlockedAchievements.filter((achievement: UnlockedAchievement) => {
        if (seen.has(achievement.id)) {
          return false;
        }
        seen.add(achievement.id);
        return true;
      });
      
      return {
        ...data,
        unlockedAchievements: deduplicatedAchievements
      };
    } catch (error) {
      console.error("Failed to load achievement data:", error);
      return { unlockedAchievements: [], lastChecked: new Date().toISOString() };
    }
  }, [user?.id]);

  // Save achievement data to localStorage
  const saveAchievementData = useCallback((data: AchievementData) => {
    try {
      localStorage.setItem(getAchievementStorageKey(user?.id), JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save achievement data:", error);
    }
  }, [user?.id]);

  // Get achievement definition by ID
  const getAchievementDefinition = useCallback((id: string): AchievementDefinition | undefined => {
    return ACHIEVEMENT_DEFINITIONS.find(def => def.id === id);
  }, []);

  // Check if achievement is already unlocked
  const isAchievementUnlocked = useCallback((achievementId: string): boolean => {
    return unlockedAchievements.some(achievement => achievement.id === achievementId);
  }, [unlockedAchievements]);

  // Unlock a new achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    const definition = getAchievementDefinition(achievementId);
    if (!definition) {
      console.error(`Achievement definition not found: ${achievementId}`);
      return;
    }

    if (isAchievementUnlocked(achievementId)) {
      return; // Already unlocked
    }

    const newAchievement: UnlockedAchievement = {
      id: achievementId,
      unlockedAt: new Date().toISOString(),
      definition
    };

    const data = loadAchievementData();
    
    // Double-check if achievement already exists in localStorage to prevent duplicates
    const existingAchievement = data.unlockedAchievements.find(a => a.id === achievementId);
    if (existingAchievement) {
      return; // Already exists in localStorage
    }
    
    data.unlockedAchievements.push(newAchievement);
    saveAchievementData(data);

    setUnlockedAchievements(prev => {
      // Check if achievement already exists in current state
      const exists = prev.some(a => a.id === achievementId);
      if (exists) return prev;
      return [...prev, newAchievement];
    });
    setNewAchievements(prev => [...prev, newAchievement]);

    // Dispatch event for notifications
    console.log("í¾‰ Dispatching achievement event:", newAchievement);
    window.dispatchEvent(new CustomEvent("achievement-unlocked", { detail: newAchievement }));
  }, [getAchievementDefinition, isAchievementUnlocked, loadAchievementData, saveAchievementData]);

  // Get recent achievements for display (max 10, last 30 days)
  const getRecentAchievements = useCallback((): UnlockedAchievement[] => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentAchievements = unlockedAchievements.filter(achievement => 
      new Date(achievement.unlockedAt) >= thirtyDaysAgo
    );

    return recentAchievements
      .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
      .slice(0, 10);
  }, [unlockedAchievements]);

  // Clear new achievements (for after showing notifications)
  const clearNewAchievements = useCallback(() => {
    setNewAchievements([]);
  }, []);

  // Load achievements on mount
  useEffect(() => {
    const data = loadAchievementData();
    setUnlockedAchievements(data.unlockedAchievements);
  }, [loadAchievementData]);

  return {
    unlockedAchievements,
    newAchievements,
    unlockAchievement,
    getRecentAchievements,
    clearNewAchievements,
    isAchievementUnlocked,
    getAchievementDefinition,
    achievementDefinitions: ACHIEVEMENT_DEFINITIONS
  };
}

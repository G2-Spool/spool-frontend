import { LifeCategory } from './index';

// Course-related types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: LifeCategory;
  totalSections: number;
  completedSections?: number;
  totalConcepts: number;
  completedConcepts?: number;
  estimatedHours: number;
  points: number;
  enrolled?: boolean;
  students: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  averageRating?: number;
  completionRate?: number;
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
  instructor?: string;
  prerequisites?: string[];
  learningObjectives?: string[];
  tags?: string[];
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  enrolledAt: Date;
  lastAccessedAt: Date;
  completedSections: number;
  completedConcepts: number;
  totalTimeSpent: number;
  currentSectionId?: string;
  currentConceptId?: string;
  completionPercentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface CourseEnrollment {
  courseId: string;
  userId: string;
  enrolledAt: Date;
  completedAt?: Date;
  certificateUrl?: string;
  finalGrade?: number;
}
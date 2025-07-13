// Re-export course types
export * from './course.types';

// User and Authentication Types
export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfile {
  id: string;
  userId: string;
  organizationId?: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  birthday?: Date;
  gradeLevel?: string;
  grade?: string; // Alias for gradeLevel
  
  // Interest Discovery
  interests: Interest[];
  careerInterests: string[];
  philanthropicInterests: string[];
  learningStyleIndicators: Record<string, any>;
  lifeCategoryWeights: LifeCategoryWeights;
  
  // Gamification
  totalPoints: number;
  currentStreakDays: number;
  longestStreakDays: number;
  lastActivityDate?: Date;
  badgesEarned: Badge[];
  level: number;
  experiencePoints: number;
  
  // Settings
  preferredSessionLength: number;
  dailyGoalMinutes: number;
  notificationPreferences: NotificationPreferences;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Interest {
  interest: string;
  category: LifeCategory;
  strength: number;
}

export type LifeCategory = 'personal' | 'social' | 'career' | 'philanthropic';

export interface LifeCategoryWeights {
  personal: number;
  social: number;
  career: number;
  philanthropic: number;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  streakReminders: boolean;
  achievementAlerts: boolean;
}

// Learning Content Types
export interface Textbook {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  description: string;
  isbn?: string;
  publisher?: string;
  publishYear?: number;
  coverImageUrl?: string;
  totalChapters: number;
  estimatedHours: number;
  topics: string[];
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  colorScheme: string;
  gradeLevels: string[];
  totalHours: number;
  prerequisiteSubjects: string[];
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  learningObjectives: string[];
  estimatedHours: number;
  difficultyLevel: DifficultyLevel;
  orderIndex: number;
  isOptional: boolean;
}

export interface Section {
  id: string;
  topicId: string;
  name: string;
  description: string;
  keyConcepts: string[];
  estimatedHours: number;
  orderIndex: number;
  practiceProblemsCount: number;
}

export interface Concept {
  id: string;
  sectionId: string;
  name: string;
  description: string;
  learningObjectives: string[];
  keyVocabulary: string[];
  contentTypes: ContentType[];
  difficultyLevel: DifficultyLevel;
  estimatedMinutes: number;
  masteryThreshold: number;
  minExamplesRequired: number;
  exerciseCount: number;
  allowsCalculator: boolean;
  orderIndex: number;
  isOptional: boolean;
}

export type ContentType = 'explanation' | 'example' | 'formula' | 'exercise' | 'definition';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Concept Display Types
export interface ConceptHook {
  id: string;
  conceptId: string;
  lifeCategory: LifeCategory;
  subCategory?: string;
  hookText: string;
  hookType: 'standard' | 'advanced' | 'simplified';
  effectivenessScore?: number;
}

export interface ConceptExample {
  id: string;
  conceptId: string;
  exampleText: string;
  visualAidUrl?: string;
  interactiveElement?: any;
  interestTags: string[];
  lifeCategory: LifeCategory;
  difficultyLevel: DifficultyLevel;
  effectivenessScore?: number;
}

export interface ConceptContent {
  hooks: ConceptHook[];
  examples: ConceptExample[];
  vocabulary: VocabularyItem[];
  mentalModel: MentalModel;
  principles: string[];
  workflow: WorkflowStep[];
}

export interface VocabularyItem {
  term: string;
  definition: string;
  pronunciation?: string;
  etymology?: string;
}

export interface MentalModel {
  description: string;
  visualUrl?: string;
  interactiveElement?: any;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  details: string[];
}

// Learning Progress Types
export interface LearningPath {
  id: string;
  studentProfileId: string;
  textbookId: string;
  subject: string;
  currentTopicId?: string;
  currentSectionId?: string;
  currentConceptId?: string;
  nextConceptId?: string;
  availableConcepts: string[];
  conceptsCompleted: number;
  conceptsTotal: number;
  conceptsMastered: number;
  averageMasteryScore?: number;
  estimatedCompletionDate?: Date;
  dailyTargetMinutes: number;
  status: LearningPathStatus;
  startedAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

export type LearningPathStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface ConceptProgress {
  id: string;
  studentProfileId: string;
  learningPathId: string;
  conceptId: string;
  conceptName: string;
  status: ConceptStatus;
  
  // Component Progress
  hookViewed: boolean;
  examplesViewed: number;
  coreContentViewed: boolean;
  initialExerciseStatus: ExerciseStatus;
  advancedExerciseStatus: ExerciseStatus;
  
  // Scoring
  initialExerciseScore?: number;
  advancedExerciseScore?: number;
  finalMasteryScore?: number;
  
  // Remediation
  remediationCount: number;
  remediationConcepts: string[];
  
  // Timing
  startedAt?: Date;
  completedAt?: Date;
  masteredAt?: Date;
  totalTimeSeconds: number;
  activeTimeSeconds: number;
  
  attemptCount: number;
  lastAttemptAt?: Date;
}

export type ConceptStatus = 'not_started' | 'viewing' | 'practicing' | 'completed' | 'mastered';
export type ExerciseStatus = 'not_started' | 'in_progress' | 'completed' | 'evaluating';

// Exercise and Assessment Types
export interface Exercise {
  id: string;
  conceptId: string;
  type: 'initial' | 'advanced' | 'remediation';
  level: DifficultyLevel;
  lifeCategory: LifeCategory;
  personalizationContext: {
    interests: string[];
    selectedInterest: string;
  };
  prompt: string;
  expectedSteps: string[];
}

export interface Assessment {
  id: string;
  studentProfileId: string;
  conceptId: string;
  exerciseId: string;
  studentResponse: string;
  identifiedSteps: string[];
  stepEvaluations: StepEvaluation[];
  missingSteps: string[];
  incorrectSteps: string[];
  stepsCorrect: number;
  stepsTotal: number;
  competencyScore: number;
  conceptualUnderstanding?: number;
  articulationQuality?: number;
  applicationAbility?: number;
  aiFeedback?: string;
  remediationNeeded: boolean;
  remediationFocus?: string;
  status: AssessmentStatus;
  submittedAt: Date;
  evaluatedAt?: Date;
  timeTakenSeconds: number;
}

export interface StepEvaluation {
  step: string;
  status: 'correct' | 'incorrect' | 'missing';
  feedback?: string;
}

export type AssessmentStatus = 'in_progress' | 'completed' | 'evaluated' | 'abandoned';

// Interview Types
export interface InterviewSession {
  id: string;
  studentProfileId: string;
  status: InterviewStatus;
  type: 'initial' | 'update' | 'supplemental';
  connectionQuality?: 'excellent' | 'good' | 'poor';
  questions: InterviewQuestion[];
  responses: InterviewResponse[];
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  totalSpeakingTime?: number;
  extractedInterests?: Interest[];
  confidenceScores?: Record<string, number>;
  aiNotes?: string;
}

export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned' | 'failed';

export interface InterviewQuestion {
  id: string;
  questionText: string;
  order: number;
}

export interface InterviewResponse {
  questionId: string;
  audioUrl?: string;
  transcript: string;
  timestamp: Date;
}

// Gamification Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  criteriaType: AchievementCriteria;
  criteriaValue: number;
  criteriaDetails: any;
  pointValue: number;
  experienceValue: number;
  category: AchievementCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  subject?: string;
  displayOrder: number;
  isSecret: boolean;
}

export type AchievementCriteria = 'streak' | 'concepts_mastered' | 'subject_completion' | 'perfect_score' | 'speed';
export type AchievementCategory = 'learning' | 'consistency' | 'mastery' | 'speed' | 'exploration';

export interface Badge {
  achievementId: string;
  earnedAt: Date;
  acknowledged: boolean;
}

export interface DailyChallenge {
  id: string;
  challengeDate: Date;
  name: string;
  description: string;
  challengeType: ChallengeType;
  targetValue: number;
  pointBonus: number;
  achievementId?: string;
  subject?: string;
  difficultyLevel?: DifficultyLevel;
}

export type ChallengeType = 'speed_run' | 'perfect_score' | 'concept_count' | 'time_spent';

// Analytics Types
export interface EngagementAnalytics {
  date: Date;
  totalMinutes: number;
  activeMinutes: number;
  lessonMinutes: number;
  exerciseMinutes: number;
  conceptsViewed: number;
  exercisesCompleted: number;
  exercisesMastered: number;
  averageSessionLength: number;
  sessionCount: number;
  engagementScore: number;
  conceptsMastered: number;
  averageMasteryScore?: number;
  remediationSessions: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
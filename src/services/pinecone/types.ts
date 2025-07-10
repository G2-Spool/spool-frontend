import type { LifeCategory } from '../../types';

// Vector types for Pinecone
export interface CourseVector {
  id: string;
  values: number[];
  metadata: {
    // Core fields
    title: string;
    description: string;
    category: LifeCategory;
    
    // Searchable attributes
    difficulty: string;
    estimatedHours: number;
    points: number;
    totalSections: number;
    totalConcepts: number;
    
    // Stats
    enrolledStudents: number;
    averageRating?: number;
    completionRate?: number;
    
    // Timestamps
    createdAt: number;
    updatedAt: number;
    
    // Search optimization
    searchableText: string;
    keywords: string[];
  };
  sparseValues?: {
    indices: number[];
    values: number[];
  };
}

export interface LearningPathVector {
  id: string;
  values: number[];
  metadata: {
    // Core fields
    title: string;
    description: string;
    category: LifeCategory;
    
    // Path structure
    courseIds: string[];
    sectionIds: string[];
    conceptIds: string[];
    
    // Progress tracking
    totalConcepts: number;
    estimatedHours: number;
    points: number;
    
    // Prerequisites
    prerequisitePathIds?: string[];
    requiredSkillLevel?: string;
    
    // Timestamps
    createdAt: number;
    updatedAt: number;
    
    // Search optimization
    searchableText: string;
    keywords: string[];
    targetAgeGroup?: string;
  };
}

export interface ConceptVector {
  id: string;
  values: number[];
  metadata: {
    // Core fields
    title: string;
    description: string;
    sectionId: string;
    courseId: string;
    pathId: string;
    
    // Content structure
    componentTypes: string[];
    exerciseTypes: string[];
    contentDuration: number;
    
    // Learning attributes
    difficulty: string;
    keyVocabulary: string[];
    learningObjectives: string[];
    
    // Prerequisites
    prerequisiteConceptIds?: string[];
    
    // Timestamps
    createdAt: number;
    updatedAt: number;
    
    // Search optimization
    searchableText: string;
    keywords: string[];
    interestTags: string[];
  };
}

// Filter metadata
export interface FilterMetadata {
  // Categorical filters
  category?: LifeCategory[];
  difficulty?: string[];
  ageGroup?: string[];
  
  // Numeric range filters
  estimatedHours?: { min: number; max: number };
  points?: { min: number; max: number };
  enrolledStudents?: { min: number; max: number };
  
  // Boolean filters
  hasVideo?: boolean;
  hasInteractive?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  
  // Multi-select filters
  keywords?: string[];
  interestTags?: string[];
  componentTypes?: string[];
}

// Search results
export interface SearchResult<T> {
  id: string;
  score: number;
  metadata: T;
}

export interface CourseSearchResult extends SearchResult<CourseVector['metadata']> {}
export interface PathSearchResult extends SearchResult<LearningPathVector['metadata']> {}
export interface ConceptSearchResult extends SearchResult<ConceptVector['metadata']> {}

// API response types
export interface PineconeSearchResponse<T> {
  matches: T[];
  namespace?: string;
  usage?: {
    readUnits: number;
  };
}
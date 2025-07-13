import { supabase } from '../config/supabase'
import type { ExerciseData } from '../types'

export interface ExerciseGenerationRequest {
  conceptId: string;
  studentProfile: {
    interests: string[];
    careerInterests: string[];
    philanthropicInterests: string[];
    lifeCategory?: 'personal' | 'social' | 'career' | 'philanthropic';
  };
  exerciseType: 'initial' | 'advanced';
  conceptName: string;
  conceptDescription?: string;
}

export interface ExerciseGenerationResponse {
  exerciseId: string;
  prompt: string;
  expectedSteps: string[];
  lifeCategory: string;
  personalizationContext: {
    selectedInterest: string;
    contextType: string;
  };
  difficulty: 'basic' | 'intermediate' | 'advanced';
}

export interface ExerciseEvaluationRequest {
  exerciseId: string;
  studentResponse: string;
  expectedSteps: string[];
}

export interface ExerciseEvaluationResponse {
  evaluationId: string;
  identifiedSteps: string[];
  missingSteps: string[];
  incorrectSteps: string[];
  stepsCorrect: number;
  stepsTotal: number;
  competencyScore: number;
  feedback: string;
  remediationNeeded: boolean;
  remediationFocus?: string;
}

class ExerciseService {
  private readonly baseUrl: string;

  constructor() {
    // Use the deployed Lambda function URL
    this.baseUrl = 'https://79dgy4x54a.execute-api.us-east-1.amazonaws.com/production/api/exercise';
  }

  async generateExercise(request: ExerciseGenerationRequest): Promise<ExerciseGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate exercise: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating exercise:', error);
      throw error;
    }
  }

  async evaluateExercise(request: ExerciseEvaluationRequest): Promise<ExerciseEvaluationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to evaluate exercise: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error evaluating exercise:', error);
      throw error;
    }
  }

  async generateRemediation(
    conceptId: string,
    targetStep: string,
    studentProfile: ExerciseGenerationRequest['studentProfile']
  ): Promise<ExerciseGenerationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/remediation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
        body: JSON.stringify({
          conceptId,
          targetStep,
          studentProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate remediation: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating remediation:', error);
      throw error;
    }
  }

  async getExerciseHistory(conceptId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/history/${conceptId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get exercise history: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting exercise history:', error);
      throw error;
    }
  }

  async getExercisesForConcept(conceptId: string): Promise<ExerciseData[]> {
    try {
      console.log('ExerciseService - fetching exercises for conceptId:', conceptId)
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('concept_id', conceptId)
        .order('exercise_number', { ascending: true })

      console.log('ExerciseService - Supabase response:', { data, error })

      if (error) {
        console.error('Error fetching exercises:', error)
        throw error
      }

      return (data || []).map(exercise => ({
        ...exercise,
        expected_steps_by_difficulty: exercise.expected_steps_by_difficulty as ExerciseData['expected_steps_by_difficulty']
      }))
    } catch (error) {
      console.error('Error in getExercisesForConcept:', error)
      return []
    }
  }

  async getExerciseById(exerciseId: string): Promise<ExerciseData | null> {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', exerciseId)
        .single()

      if (error) {
        console.error('Error fetching exercise:', error)
        return null
      }

      return data ? {
        ...data,
        expected_steps_by_difficulty: data.expected_steps_by_difficulty as ExerciseData['expected_steps_by_difficulty']
      } : null
    } catch (error) {
      console.error('Error in getExerciseById:', error)
      return null
    }
  }

  async getAllExercises(): Promise<ExerciseData[]> {
    try {
      console.log('ExerciseService - fetching all exercises')
      
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .order('concept_id', { ascending: true })
        .order('exercise_number', { ascending: true })

      console.log('ExerciseService - All exercises:', { data, error })

      if (error) {
        console.error('Error fetching all exercises:', error)
        throw error
      }

      return (data || []).map(exercise => ({
        ...exercise,
        expected_steps_by_difficulty: exercise.expected_steps_by_difficulty as ExerciseData['expected_steps_by_difficulty']
      }))
    } catch (error) {
      console.error('Error in getAllExercises:', error)
      return []
    }
  }
}

export const exerciseService = new ExerciseService();
import { API_BASE_URL } from '../config/api';

export interface ExerciseGenerationRequest {
  concept_id: string;
  student_id: string;
  student_interests: string[];
  life_category: 'personal' | 'social' | 'career' | 'philanthropic';
  difficulty?: 'basic' | 'intermediate' | 'advanced';
  previous_exercise_id?: string;
}

export interface ExerciseGenerationResponse {
  exercise: {
    exercise_id: string;
    concept_id: string;
    student_id: string;
    type: 'initial' | 'advanced' | 'remediation' | 'practice';
    difficulty: 'basic' | 'intermediate' | 'advanced';
    content: {
      scenario: string;
      problem: string;
      expected_steps: string[];
      success_criteria: string;
      cognitive_scaffolds: string[];
      metacognitive_prompts: string[];
      hints: string[];
    };
    personalization: {
      life_category: string;
      interests_used: string[];
      context_type: string;
      selected_interest: string;
    };
    expected_steps: string[];
    hints: string[];
    created_at: string;
    metadata: Record<string, any>;
  };
  message: string;
}

// Legacy interface for backward compatibility
export interface LegacyExerciseGenerationRequest {
  conceptId: string;
  conceptName: string;
  conceptDescription?: string;
  studentProfile: {
    interests: string[];
    careerInterests: string[];
    philanthropicInterests: string[];
  };
  exerciseType: 'initial' | 'advanced';
}

// Legacy response interface for backward compatibility
export interface LegacyExerciseGenerationResponse {
  exerciseId: string;
  prompt: string;
  expectedSteps: string[];
  hints: string[];
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
    // Check for local development
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalDev) {
      // Use local backend for development
      this.baseUrl = 'http://localhost:8003/api/exercise';
      console.log('🔧 Using LOCAL exercise service:', this.baseUrl);
    } else {
      // Use the deployed Lambda function URL for production
      this.baseUrl = 'https://79dgy4x54a.execute-api.us-east-1.amazonaws.com/production/api/exercise';
      console.log('🚀 Using PRODUCTION exercise service:', this.baseUrl);
    }
  }

  async generateExercise(request: LegacyExerciseGenerationRequest): Promise<LegacyExerciseGenerationResponse> {
    try {
      // Transform legacy request to new API format
      const apiRequest: ExerciseGenerationRequest = {
        concept_id: request.conceptId,
        student_id: 'student_123', // TODO: Get from auth context
        student_interests: request.studentProfile.interests,
        life_category: this.selectLifeCategory(request.studentProfile),
        difficulty: 'basic',
      };

      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
        body: JSON.stringify(apiRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate exercise: ${response.statusText}`);
      }

      const apiResponse: ExerciseGenerationResponse = await response.json();
      
      // Transform API response to legacy format
      const content = apiResponse.exercise.content;
      const personalization = apiResponse.exercise.personalization;
      
      // Combine scenario and problem for the prompt
      const prompt = content.scenario ? 
        `${content.scenario}\n\n${content.problem}` : 
        content.problem;
      
      return {
        exerciseId: apiResponse.exercise.exercise_id,
        prompt: prompt,
        expectedSteps: apiResponse.exercise.expected_steps,
        hints: content.hints || [],
        lifeCategory: personalization.life_category,
        personalizationContext: {
          selectedInterest: personalization.interests_used?.[0] || 'your interests',
          contextType: personalization.life_category,
        },
        difficulty: apiResponse.exercise.difficulty,
      };
    } catch (error) {
      console.error('Error generating exercise:', error);
      throw error;
    }
  }

  private selectLifeCategory(studentProfile: LegacyExerciseGenerationRequest['studentProfile']): 'personal' | 'social' | 'career' | 'philanthropic' {
    // Simple logic to select life category based on interests
    if (studentProfile.careerInterests && studentProfile.careerInterests.length > 0) {
      return 'career';
    }
    if (studentProfile.philanthropicInterests && studentProfile.philanthropicInterests.length > 0) {
      return 'philanthropic';
    }
    if (studentProfile.interests.some(interest => 
      ['gaming', 'sports', 'music', 'art', 'reading', 'movies'].includes(interest.toLowerCase())
    )) {
      return 'personal';
    }
    return 'social';
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
    studentProfile: LegacyExerciseGenerationRequest['studentProfile']
  ): Promise<LegacyExerciseGenerationResponse> {
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

  async getHint(
    exerciseId: string,
    currentStep: number,
    chatContext: string[]
  ): Promise<{ hint: string; stepNumber: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/hint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('idToken')}`,
        },
        body: JSON.stringify({
          exerciseId,
          currentStep,
          chatContext,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get hint: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting hint:', error);
      // Fallback hint if API fails
      return {
        hint: "Think about breaking this problem into smaller steps. What information do you have, and what do you need to find?",
        stepNumber: currentStep + 1
      };
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
}

export const exerciseService = new ExerciseService();
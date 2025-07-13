import { API_ENDPOINTS } from '../config/api'
import api from './api'
import { 
  SpoolExercise, 
  ExerciseSubmission, 
  ExerciseRequest, 
  ExerciseOption 
} from '../types/backend.types'


// ===== EXERCISE GENERATION =====
export async function generateExercise(request: ExerciseRequest): Promise<SpoolExercise | null> {
  try {
    const response = await api.post<SpoolExercise>(API_ENDPOINTS.exerciseGeneration, request);
    return response || null;
  } catch (error) {
    console.error('Failed to generate exercise:', error);
    return null;
  }
}

export async function generatePersonalizedExercise(
  conceptId: string,
  userInterests: string[] = [],
  learningGoals: string[] = [],
  previousPerformance: number = 0,
  difficulty?: 'beginner' | 'intermediate' | 'advanced',
  exerciseType?: 'multiple_choice' | 'short_answer' | 'essay' | 'problem_solving' | 'code'
): Promise<SpoolExercise | null> {
  const request: ExerciseRequest = {
    concept_id: conceptId,
    difficulty_level: difficulty,
    exercise_type: exerciseType,
    user_context: {
      interests: userInterests,
      learning_goals: learningGoals,
      previous_performance: previousPerformance
    }
  }

  return await generateExercise(request)
}

export async function generateMultipleExercises(
  conceptId: string,
  count: number = 5,
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
): Promise<SpoolExercise[]> {
  try {
    const response = await api.post<SpoolExercise[]>(API_ENDPOINTS.exerciseGeneration, {
      concept_id: conceptId,
      count,
      difficulty_level: difficulty
    });
    return response || [];
  } catch (error) {
    console.error('Failed to generate multiple exercises:', error);
    return [];
  }
}

// ===== EXERCISE RETRIEVAL =====
export async function getExercises(conceptId?: string): Promise<SpoolExercise[]> {
  try {
    const url = conceptId 
      ? `${API_ENDPOINTS.exerciseGeneration}?concept_id=${conceptId}`
      : API_ENDPOINTS.exerciseGeneration;
    const response = await api.get<SpoolExercise[]>(url);
    return response || [];
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
    return [];
  }
}

export async function getExerciseById(exerciseId: string): Promise<SpoolExercise | null> {
  try {
    const response = await api.get<SpoolExercise>(`${API_ENDPOINTS.exerciseGeneration}/${exerciseId}`);
    return response || null;
  } catch (error) {
    console.error(`Failed to fetch exercise ${exerciseId}:`, error);
    return null;
  }
}

// ===== EXERCISE SUBMISSION =====
export async function submitExerciseAnswer(
  exerciseId: string,
  userId: string,
  answer: string
): Promise<ExerciseSubmission | null> {
  try {
    const response = await api.post<ExerciseSubmission>(`${API_ENDPOINTS.exerciseGeneration}/submit`, {
      exercise_id: exerciseId,
      user_id: userId,
      answer
    });
    return response || null;
  } catch (error) {
    console.error('Failed to submit exercise answer:', error);
    return null;
  }
}

export async function assessAnswer(
  exerciseId: string,
  answer: string,
  userId?: string
): Promise<{
  is_correct: boolean
  score: number
  feedback: string
  explanation?: string
} | null> {
  try {
    const response = await api.post<{
      is_correct: boolean
      score: number
      feedback: string
      explanation?: string
    }>(`${API_ENDPOINTS.exerciseGeneration}/assess`, {
      exercise_id: exerciseId,
      answer,
      user_id: userId
    });
    return response || null;
  } catch (error) {
    console.error('Failed to assess answer:', error);
    return null;
  }
}

// ===== EXERCISE UTILITIES =====
export function isMultipleChoiceExercise(exercise: SpoolExercise): boolean {
  return exercise.type === 'multiple_choice' && !!exercise.options && exercise.options.length > 0
}

export function getCorrectAnswer(exercise: SpoolExercise): string | null {
  if (exercise.type === 'multiple_choice' && exercise.options) {
    const correctOption = exercise.options.find(option => option.is_correct === true)
    return correctOption ? correctOption.text : null
  }
  return exercise.correct_answer || null
}

export function shuffleOptions(options: ExerciseOption[]): ExerciseOption[] {
  const shuffled = [...options]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function formatExerciseForDisplay(exercise: SpoolExercise): SpoolExercise {
  if (exercise.type === 'multiple_choice' && exercise.options) {
    return {
      ...exercise,
      options: shuffleOptions(exercise.options)
    }
  }
  return exercise
}

export function calculateScore(
  isCorrect: boolean,
  timeSpent: number,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): number {
  if (!isCorrect) return 0
  
  const baseScore = difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 15 : 20
  const timeBonus = Math.max(0, 5 - Math.floor(timeSpent / 30)) // Bonus for quick answers
  
  return baseScore + timeBonus
}

export function getDifficultyColor(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-600'
    case 'intermediate':
      return 'text-yellow-600'
    case 'advanced':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

export function getExerciseTypeIcon(type: string): string {
  switch (type) {
    case 'multiple_choice':
      return '📝'
    case 'short_answer':
      return '✍️'
    case 'essay':
      return '📄'
    case 'problem_solving':
      return '🧮'
    case 'code':
      return '💻'
    default:
      return '❓'
  }
}
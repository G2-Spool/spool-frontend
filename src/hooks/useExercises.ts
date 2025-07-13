import { useQuery } from '@tanstack/react-query'
import { exerciseService } from '../services/exercise.service'
import type { ExerciseData } from '../types'

export function useExercisesForConcept(conceptId: string) {
  return useQuery<ExerciseData[]>({
    queryKey: ['exercises', 'concept', conceptId],
    queryFn: () => exerciseService.getExercisesForConcept(conceptId),
    enabled: !!conceptId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useExerciseById(exerciseId: string) {
  return useQuery<ExerciseData | null>({
    queryKey: ['exercises', exerciseId],
    queryFn: () => exerciseService.getExerciseById(exerciseId),
    enabled: !!exerciseId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 
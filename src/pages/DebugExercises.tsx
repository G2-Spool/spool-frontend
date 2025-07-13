import React, { useEffect, useState } from 'react'
import { exerciseService } from '../services/exercise.service'
import type { ExerciseData } from '../types'

export const DebugExercises: React.FC = () => {
  const [exercises, setExercises] = useState<ExerciseData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exerciseService.getAllExercises()
        setExercises(data)
      } catch (error) {
        console.error('Error fetching exercises:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  if (loading) {
    return <div className="p-8">Loading exercises...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Exercises in Database</h1>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
        <p className="font-semibold">Total exercises: {exercises.length}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Unique concept IDs: {[...new Set(exercises.map(e => e.concept_id))].join(', ')}
        </p>
      </div>

      {exercises.map((exercise) => (
        <div key={exercise.id} className="mb-6 p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">
            {exercise.base_title} (Exercise #{exercise.exercise_number})
          </h2>
          <div className="space-y-1 text-sm">
            <p><strong>ID:</strong> {exercise.id}</p>
            <p><strong>Concept ID:</strong> {exercise.concept_id || 'null'}</p>
            <p><strong>Context:</strong> {exercise.base_context}</p>
            <p><strong>Scenario:</strong> {exercise.base_scenario_template.substring(0, 100)}...</p>
            <p><strong>Hint:</strong> {exercise.base_hint_template.substring(0, 100)}...</p>
            <p><strong>Difficulty Levels:</strong> {Object.keys(exercise.expected_steps_by_difficulty).join(', ')}</p>
          </div>
        </div>
      ))}
    </div>
  )
} 
/**
 * TestStudyStreak Component
 * 
 * A test component for debugging and displaying study streak information.
 * This is a placeholder component used in the dashboard for testing purposes.
 */

import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { useStudyStreak } from '@/hooks/useStudyStreak'

export function TestStudyStreak() {
  const { studyStreak, recordCompletion } = useStudyStreak()

  const handleTestCompletion = () => {
    recordCompletion('test-concept', 'test-topic')
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Study Streak Test</h3>
          <p className="text-sm text-muted-foreground">
            Debug information for study streak functionality
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="text-2xl font-bold text-foreground">{studyStreak.currentStreak}</div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Longest Streak</div>
            <div className="text-2xl font-bold text-foreground">{studyStreak.longestStreak}</div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Total Completions</div>
            <div className="text-2xl font-bold text-foreground">{studyStreak.totalCompletions}</div>
          </div>
          
          <div className="p-3 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground">Last Completion</div>
            <div className="text-sm text-foreground">
              {studyStreak.lastCompletionDate 
                ? new Date(studyStreak.lastCompletionDate).toLocaleDateString()
                : 'Never'
              }
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleTestCompletion}
          className="w-full"
        >
          Test Record Completion
        </Button>
      </div>
    </Card>
  )
} 
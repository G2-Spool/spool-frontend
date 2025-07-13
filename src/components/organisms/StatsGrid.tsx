import { StatCard } from "../atoms/StatCard"
import { ProgressBar } from "../molecules/ProgressBar"
import { Calendar, Clock, Flame } from "lucide-react"

interface StatsGridProps {
  studyStreak: number
  weeklyConsistency?: { percentage: number; daysCompleted: number; totalDays: number }
  learningPace?: string
  streakStatus?: { message: string; isActive: boolean }
  todayCompletions: number
}

export function StatsGrid({ studyStreak, streakStatus, todayCompletions }: StatsGridProps) {
  const dailyGoal = 5 // Default daily goal of 5 concepts
  const dailyProgress = Math.min(100, Math.round((todayCompletions / dailyGoal) * 100))

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatCard 
        title="Study Streak" 
        value={
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span>{studyStreak} days</span>
          </div>
        } 
        description={streakStatus?.message || "Keep it up!"} 
        icon={Calendar} 
      />

      <StatCard title="Today's Progress" value={`${dailyProgress}%`} description={`${todayCompletions}/${dailyGoal} concepts`} icon={Clock}>
        <ProgressBar value={dailyProgress} className="mt-2" />
      </StatCard>
    </div>
  )
} 
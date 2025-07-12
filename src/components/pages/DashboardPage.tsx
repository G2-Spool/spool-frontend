/**
 * DashboardPage Component
 * 
 * Main dashboard page displaying user statistics, study focus, interests,
 * achievements, and quick actions. This is a simplified version of the
 * original Spool-GitHub dashboard with placeholder data and reduced complexity.
 * 
 * Features:
 * - Study statistics and streak information
 * - Current study focus and progress
 * - User interests display
 * - Recent achievements
 * - Quick action to continue learning
 * - Test interface for debugging
 */

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs'
import { PageHeader } from '@/components/templates/PageHeader'
import { StatsGrid } from '@/components/organisms/StatsGrid'
import { StudyFocusCard } from '@/components/organisms/StudyFocusCard'
import { InterestsCard } from '@/components/organisms/InterestsCard'
import { AchievementsList } from '@/components/organisms/AchievementsList'
import { TestStudyStreak } from '@/components/test/TestStudyStreak'
import { Card } from '@/components/atoms/Card'
import { Button } from '@/components/atoms/Button'
import { ArrowRight } from 'lucide-react'
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation'
import { useStudyStreak } from '@/hooks/useStudyStreak'
import { useAchievements } from '@/hooks/useAchievements'
import { useAuth } from '@/contexts/AuthContext'

interface UserProfile {
  interests: string[]
  studyGoals: {
    subject: string
    topic: string
    focusArea: string
  }
  learningPace: string
}

const defaultProfile: UserProfile = {
  interests: ["Technology", "Science", "Reading", "Gaming", "Music"],
  studyGoals: {
    subject: "Mathematics",
    topic: "Algebra",
    focusArea: "Linear Equations"
  },
  learningPace: "steady"
}

// Mock available classes for StudyFocusCard
const mockClasses = [
  {
    id: 'college-algebra',
    title: 'College Algebra',
    subject: 'Mathematics',
    description: 'Linear equations, quadratic functions, and polynomial expressions',
    progress: 45,
    color: 'bg-blue-500'
  },
  {
    id: 'biology',
    title: 'Biology Fundamentals',
    subject: 'Science',
    description: 'Cell structure, genetics, and basic biological processes',
    progress: 20,
    color: 'bg-green-500'
  },
  {
    id: 'psychology',
    title: 'Introduction to Psychology',
    subject: 'Social Sciences',
    description: 'Cognitive processes, behavioral patterns, and mental health',
    progress: 65,
    color: 'bg-purple-500'
  }
]

export function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile)
  const { user } = useAuth()
  const { navigateToTab, navigateToUrl } = useUnifiedNavigation()
  const { studyStreak } = useStudyStreak()
  const { getRecentAchievements, checkAchievements } = useAchievements()

  // Load user profile from localStorage if available
  useEffect(() => {
    if (!user?.id) return

    const profileKey = `user-profile-${user.id}`
    const profile = localStorage.getItem(profileKey)
    
    if (profile) {
      try {
        const parsedProfile = JSON.parse(profile)
        const mergedProfile = {
          ...defaultProfile,
          ...parsedProfile
        }
        setUserProfile(mergedProfile)
        localStorage.setItem(profileKey, JSON.stringify(mergedProfile))
      } catch (error) {
        console.error("Failed to parse user profile, using default:", error)
        localStorage.setItem(profileKey, JSON.stringify(defaultProfile))
      }
    } else {
      console.log("No user profile found, creating default profile")
      localStorage.setItem(profileKey, JSON.stringify(defaultProfile))
      setUserProfile(defaultProfile)
    }
  }, [user?.id])

  // Check achievements on component mount
  useEffect(() => {
    checkAchievements()
  }, [checkAchievements])

  // Mock study focus data
  const currentStudyFocus = {
    subject: userProfile.studyGoals.subject,
    topic: userProfile.studyGoals.topic,
    focusArea: userProfile.studyGoals.focusArea,
    progress: 45,
    currentConcept: "Solving Two-Step Equations"
  }

  // Mock streak status
  const getStreakStatus = () => {
    if (studyStreak.currentStreak === 0) {
      return { message: 'Start your learning journey!', isActive: false }
    }
    if (studyStreak.currentStreak < 3) {
      return { message: 'Building momentum...', isActive: true }
    }
    if (studyStreak.currentStreak < 7) {
      return { message: 'Strong streak going!', isActive: true }
    }
    return { message: 'You\'re on fire! 🔥', isActive: true }
  }

  // Mock today's completions
  const todayCompletions = 2

  // Get recent achievements
  const recentAchievements = getRecentAchievements()

  const handleContinueLearning = () => {
    // Navigate to a learning page - placeholder for now
    navigateToUrl('/learn/college-algebra/linear-equations')
  }

  const handleClassClick = (classId: string) => {
    navigateToUrl(`/topic/${classId}`)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <PageHeader 
            title="Dashboard" 
            description="Track your learning progress and achievements" 
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="test-stats">Test Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Grid */}
            <StatsGrid
              studyStreak={studyStreak.currentStreak}
              streakStatus={getStreakStatus()}
              todayCompletions={todayCompletions}
            />

            {/* Study Focus and Interests */}
            <div className="grid gap-6 md:grid-cols-2">
              <StudyFocusCard
                classes={mockClasses}
                onClassClick={handleClassClick}
              />
              <InterestsCard interests={userProfile.interests} />
            </div>

            {/* Quick Actions and Achievements */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Quick Actions */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Quick Actions</h3>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="flex items-center justify-between p-4 h-auto w-full"
                    onClick={handleContinueLearning}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <ArrowRight className="h-5 w-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">Continue Learning</p>
                        <p className="text-sm text-muted-foreground">
                          Resume {currentStudyFocus.topic} • {currentStudyFocus.focusArea}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Recent Achievements */}
              <AchievementsList achievements={recentAchievements} />
            </div>
          </TabsContent>

          <TabsContent value="test-stats" className="space-y-6">
            <TestStudyStreak />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 
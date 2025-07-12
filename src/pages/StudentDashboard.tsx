import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useActiveLearningPath } from '../hooks/useLearningPaths';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { LearningPathCard } from '../components/molecules/LearningPathCard';
import { InterviewModal } from '../components/organisms/InterviewModal';
import { useIsMobile } from '../hooks/useMobile';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  Plus,
  ArrowRight,
  Award,
  TrendingUp,
  Flame,
  Calendar,
  BarChart3,
  Star,
  Brain,
  Lightbulb,
  Users,
  Globe,
  Heart,
  Briefcase,
  Target,
} from 'lucide-react';

interface UserProfile {
  interests: string[]
  studyGoals: any
  learningPace: string
}

const defaultProfile: UserProfile = {
  interests: ["Technology", "Science", "Reading"],
  studyGoals: {
    subject: "mathematics",
    topic: "Algebra",
    focusArea: "Linear Equations"
  },
  learningPace: "steady"
}

// Enhanced Stats Grid Component
const StatsGrid: React.FC<{
  studyStreak: number;
  weeklyConsistency: number;
  learningPace: string;
  streakStatus: string;
  todayCompletions: number;
}> = ({ studyStreak, weeklyConsistency, learningPace, streakStatus, todayCompletions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-muted/50 to-muted/70 dark:from-muted/20 dark:to-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Flame className="h-4 w-4" />
            Study Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">
            {studyStreak} days
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {streakStatus}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Weekly Consistency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {weeklyConsistency}%
          </div>
          <Progress value={weeklyConsistency} className="mt-2" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-muted/50 to-muted/70 dark:from-muted/20 dark:to-muted/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Learning Pace
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground capitalize">
            {learningPace}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Optimal for you
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-accent flex items-center gap-2">
            <Target className="h-4 w-4" />
            Today's Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">
            {todayCompletions}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Exercises completed
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Study Focus Card Component
const StudyFocusCard: React.FC<{
  subject: string;
  topic: string;
  focusArea: string;
}> = ({ subject, topic, focusArea }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Current Focus
        </CardTitle>
        <CardDescription>
          Continue where you left off
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <Badge variant="outline" className="mb-2">
              {subject}
            </Badge>
            <h3 className="font-semibold text-lg">{topic}</h3>
            <p className="text-sm text-muted-foreground">{focusArea}</p>
          </div>
          <Button 
            className="w-full"
            onClick={() => navigate('/learning')}
          >
            Continue Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Interests Card Component
const InterestsCard: React.FC<{ interests: string[] }> = ({ interests }) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'personal': return Heart;
      case 'social': return Users;
      case 'career': return Briefcase;
      case 'philanthropic': return Globe;
      default: return Lightbulb;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Your Interests
        </CardTitle>
        <CardDescription>
          Driving your personalized learning journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {interests.map((interest, index) => {
            const Icon = getCategoryIcon(interest);
            return (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <Icon className="h-3 w-3" />
                {interest}
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

// Achievements List Component
const AchievementsList: React.FC = () => {
  const achievements = [
    { id: 1, title: "First Steps", description: "Completed your first lesson", date: "2 days ago", type: "milestone" },
    { id: 2, title: "Consistent Learner", description: "7-day learning streak", date: "1 week ago", type: "streak" },
    { id: 3, title: "Math Master", description: "Completed 10 algebra problems", date: "3 days ago", type: "subject" },
  ];

  return (
    <div className="space-y-3">
      {achievements.map((achievement) => (
        <Card key={achievement.id} className="p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Award className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{achievement.title}</h4>
              <p className="text-xs text-muted-foreground">{achievement.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { studentProfile, user } = useAuth();
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const isMobile = useIsMobile();
  const [preferredTab, setPreferredTab] = useLocalStorage<string>('dashboard-preferred-tab', 'overview');
  
  // Fetch real data from API
  const { data: activePath } = useActiveLearningPath();

  // Mock data for study streak and achievements
  const currentStreak = studentProfile?.currentStreakDays || 5;
  const todayCompletions = 3;
  const getWeeklyConsistency = () => 85;
  const getStreakStatus = () => "Keep it up! 🔥";

  useEffect(() => {
    if (!user?.id) return;
    
    const getUserProfileKey = (userId: string) => `user-profile-${userId}`;
    const profileKey = getUserProfileKey(user.id);
    const profile = localStorage.getItem(profileKey);
    
    if (profile) {
      try {
        const parsedProfile = JSON.parse(profile);
        const mergedProfile = { ...defaultProfile, ...parsedProfile };
        setUserProfile(mergedProfile);
      } catch (error) {
        console.error("Failed to parse user profile:", error);
      }
    }
  }, [user?.id]);

  const getCurrentStudyFocus = () => {
    return {
      subject: userProfile.studyGoals.subject || "Mathematics",
      topic: userProfile.studyGoals.topic || "Algebra",
      focusArea: userProfile.studyGoals.focusArea || "Linear Equations"
    };
  };

  const currentStudyFocus = getCurrentStudyFocus();

  if (!studentProfile || !user) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your learning progress and achievements
            </p>
          </div>
          <Button
            onClick={() => setShowInterviewModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Thread
          </Button>
        </div>

        <Tabs defaultValue={preferredTab} onValueChange={setPreferredTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StatsGrid
              studyStreak={currentStreak}
              weeklyConsistency={getWeeklyConsistency()}
              learningPace={userProfile.learningPace}
              streakStatus={getStreakStatus()}
              todayCompletions={todayCompletions}
            />

            <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
              <StudyFocusCard
                subject={currentStudyFocus.subject}
                topic={currentStudyFocus.topic}
                focusArea={currentStudyFocus.focusArea}
              />
              <InterestsCard interests={userProfile.interests} />
            </div>

            {/* Continue Thread */}
            {activePath && (
              <Card>
                <CardHeader>
                  <CardTitle>Continue Thread</CardTitle>
                  <CardDescription>
                    Pick up where you left off
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-w-xl">
                    <LearningPathCard {...activePath} />
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>
                  Your learning milestones and accomplishments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AchievementsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Analytics</CardTitle>
                  <CardDescription>
                    Coming soon - detailed insights into your learning patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Progress Trends</CardTitle>
                  <CardDescription>
                    Coming soon - track your progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Interview Modal */}
      <InterviewModal
        isOpen={showInterviewModal}
        onClose={() => setShowInterviewModal(false)}
        mode="interests"
      />
    </div>
  );
};
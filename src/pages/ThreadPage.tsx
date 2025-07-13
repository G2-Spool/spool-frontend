import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { 
  ArrowLeft, 
  Clock, 
  Brain, 
  BookOpen,
  ChevronRight,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Sparkles,
  PlayCircle,
  CheckCircle,
  BarChart3,
  Zap,
  Award,
  X
} from 'lucide-react';
import { useThread } from '../hooks/useThread';
import { ThreadSectionsSidebar } from '../components/organisms/ThreadSectionsSidebar';
import { TwoStageExercise } from '../components/organisms/TwoStageExercise';
import { cn } from '../utils/cn';
import { MarkdownText } from '../utils/markdown';

// Mock student profile - in production this would come from user context
const mockStudentProfile = {
  interests: ['gaming', 'technology', 'music', 'sports'],
  careerInterests: ['software development', 'game design'],
  philanthropicInterests: ['education', 'environment'],
};

export const ThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showExercise, setShowExercise] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [sectionProgress, setSectionProgress] = useState<Record<string, 'reading' | 'exercising' | 'completed'>>({});
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [showLearningTip, setShowLearningTip] = useState(true);
  
  // Fetch thread data
  const { data: thread, isLoading, error } = useThread(threadId || '');
  
  // Get difficulty color to match sidebar
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'intermediate':
        return 'text-yellow-700 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'advanced':
        return 'text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  // Get relevance color based on score
  const getRelevanceColor = (score: number) => {
    const percentage = Math.round(score * 100);
    if (percentage < 30) {
      return 'text-red-600 dark:text-red-400';
    } else if (percentage <= 70) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else {
      return 'text-green-600 dark:text-green-400';
    }
  };
  
  // Set initial selected section
  useEffect(() => {
    if (thread?.sections && thread.sections.length > 0 && !selectedSection) {
      setSelectedSection(thread.sections[0].id);
    }
  }, [thread, selectedSection]);

  // Handle scroll for floating CTA - Disabled for dual scroll layout
  useEffect(() => {
    // Floating CTA disabled when using dual scroll layout
    setShowFloatingCTA(false);
  }, []);
  
  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleStartExercise = () => {
    if (selectedSection) {
      setSectionProgress(prev => ({ ...prev, [selectedSection]: 'exercising' }));
      setShowExercise(true);
    }
  };

  const handleExerciseComplete = () => {
    if (selectedSection) {
      setCompletedSections(prev => new Set([...prev, selectedSection]));
      setSectionProgress(prev => ({ ...prev, [selectedSection]: 'completed' }));
      setShowExercise(false);
      
      // Auto-advance to next section if available
      const currentIndex = thread?.sections.findIndex(s => s.id === selectedSection) ?? -1;
      if (currentIndex >= 0 && currentIndex < (thread?.sections.length ?? 0) - 1) {
        setTimeout(() => {
          setSelectedSection(thread?.sections[currentIndex + 1].id ?? null);
        }, 1500);
      }
    }
  };

  const getProgressPercentage = () => {
    if (!thread?.sections) return 0;
    return (completedSections.size / thread.sections.length) * 100;
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full">
        {/* Loading skeleton */}
        <div className="flex-1 p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-8"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <div className="w-80 bg-gray-50 dark:bg-gray-800 p-4 animate-pulse">
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !thread) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md text-center p-8">
          <h2 className="text-xl font-semibold text-error mb-2">Thread Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't find the thread you're looking for.
          </p>
          <Button onClick={() => navigate('/threads')}>
            <ArrowLeft className="w-6 h-3 mr-2" />
            Back to Courses
          </Button>
        </Card>
      </div>
    );
  }
  
  const currentSection = thread.sections.find(s => s.id === selectedSection);
  const currentSectionStatus = selectedSection ? sectionProgress[selectedSection] || 'reading' : 'reading';
  
  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto" id="main-content">
        <div className="w-full">
          {/* Header */}
          <div className="mb-8 px-8 pt-8">
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/threads')}
              className="mb-4 rounded-lg px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2 -ml-2"
            >
              <ArrowLeft className="w-8 h-5" />
            </Button>
            
            <h1 className="text-4xl font-bold text-obsidian dark:text-gray-100 mb-6 text-center">
              Learning Thread
            </h1>

            {/* Enhanced Progress Section */}
            <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Learning Progress</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {completedSections.size === 0 
                        ? "Start your journey by reading and practicing"
                        : completedSections.size === thread.sections.length 
                        ? "Congratulations! You've mastered all sections!" 
                        : "Keep going! You're making great progress"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                    {Math.round(getProgressPercentage())}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {completedSections.size} of {thread.sections.length} sections
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-500 h-3 rounded-full transition-all duration-700 ease-out relative"
                    style={{ width: `${getProgressPercentage()}%` }}
                  >
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>
                </div>
                
                {/* Milestone markers */}
                <div className="absolute top-0 left-0 w-full h-3 flex items-center">
                  {[25, 50, 75].map((milestone) => (
                    <div
                      key={milestone}
                      className={cn(
                        "absolute w-0.5 h-5 -top-1 transform -translate-x-1/2 transition-all duration-300",
                        getProgressPercentage() >= milestone 
                          ? "bg-teal-600 dark:bg-teal-400" 
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                      style={{ left: `${milestone}%` }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Achievement badges */}
              {completedSections.size > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  {completedSections.size >= 1 && (
                    <Badge variant="success" size="sm">
                      <Award className="h-3 w-3 mr-1" />
                      First Step
                    </Badge>
                  )}
                  {completedSections.size >= Math.floor(thread.sections.length / 2) && (
                    <Badge variant="primary" size="sm">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Halfway There
                    </Badge>
                  )}
                  {completedSections.size === thread.sections.length && (
                    <Badge variant="warning" size="sm">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Master
                    </Badge>
                  )}
                </div>
              )}
            </div>
            
            {/* Analysis Summary */}
            <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 p-4 mb-6">
              <div className="flex items-start gap-3">
                <Brain className="h-8 w-8 text-teal-600 dark:text-teal-400 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-teal-950 dark:text-teal-300 mb-1">Your Learning Focus</h3>
                  <p className="text-white text-base">{thread.analysis.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {thread.analysis.subjects.map((subject: string, idx: number) => (
                      <Badge key={idx} variant="primary" size="sm">
                        {subject}
                      </Badge>
                    ))}
                    {thread.analysis.topics.map((topic: string, idx: number) => (
                      <Badge key={idx} variant="default" size="sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{thread.sections.length} sections</span> matched your query
            </div>
          </div>
          
          {/* Selected Section Content or Exercise */}
          {currentSection && (
            <div className="space-y-6 px-8 pb-8">
              {showExercise && currentSectionStatus === 'exercising' ? (
                <TwoStageExercise
                  conceptId={currentSection.id}
                  conceptName={currentSection.title}
                  conceptDescription={currentSection.text.substring(0, 200)}
                  studentProfile={mockStudentProfile}
                  onComplete={handleExerciseComplete}
                />
              ) : (
                <>
                  <Card className="p-6 bg-gray-50 dark:bg-gray-800/80">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100">
                            {currentSection.title}
                          </h2>
                          {currentSectionStatus === 'completed' && (
                            <Badge variant="success" size="sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-base text-gray-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className={cn("h-4 w-4", getRelevanceColor(currentSection.relevanceScore))} />
                            <span className={getRelevanceColor(currentSection.relevanceScore)}>
                              {Math.round(currentSection.relevanceScore * 100)}% relevant
                            </span>
                          </div>
                          {currentSection.estimatedMinutes && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{currentSection.estimatedMinutes} min</span>
                            </div>
                          )}
                          {currentSection.difficulty && (
                            <span className={cn(
                              "text-sm font-medium px-2 py-0.5 rounded-full",
                              getDifficultyColor(currentSection.difficulty)
                            )}>
                              {currentSection.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Section Text Content */}
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        <MarkdownText text={currentSection.text} />
                      </p>
                    </div>
                    
                    {/* Learning Tips */}
                    {showLearningTip && (
                      <div className="mt-6 p-4 bg-yellow-200 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 rounded-lg relative">
                        <button
                          onClick={() => setShowLearningTip(false)}
                          className="absolute top-3 right-3 p-1 hover:bg-yellow-300 dark:hover:bg-yellow-800/50 rounded-full transition-colors duration-200"
                        >
                          <X className="h-4 w-4 text-gray-400" />
                        </button>
                        <div className="flex items-start gap-2 pr-8">
                          <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Learning Tip</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              This section connects to key concepts in {thread.analysis.subjects.join(' and ')}. 
                              Try to relate this material to what you already know about these subjects.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Related Concepts */}
                    {currentSection.conceptIds && currentSection.conceptIds.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-obsidian dark:text-gray-100 mb-4">
                          Related Concepts
                        </h3>
                        <div className="space-y-0">
                          {['Machine Learning Fundamentals', 'Data Processing Techniques', 'Pattern Recognition', 'Algorithm Optimization'].map((conceptName, index) => (
                            <div key={index}>
                              <div className="group flex items-center justify-between py-3 px-2 -mx-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:shadow-sm hover:scale-[1.02] transition-all duration-200 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <BookOpen className="h-4 w-4 text-teal-600 dark:text-teal-400 transition-colors duration-200 group-hover:text-teal-700 dark:group-hover:text-teal-300" />
                                  <span className="text-gray-900 dark:text-gray-100 font-medium transition-colors duration-200">{conceptName}</span>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-0.5" />
                              </div>
                              {index < 3 && (
                                <div className="border-b border-gray-200 dark:border-gray-700" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Two Stage Exercise CTA Section */}
                  {currentSectionStatus !== 'completed' && (
                    <Card className="relative overflow-hidden p-6 bg-gradient-to-br from-teal-50 via-blue-50 to-purple-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-2 border-teal-300 dark:border-teal-700 shadow-lg hover:shadow-xl transition-all duration-300">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full blur-3xl transform translate-x-32 -translate-y-32 animate-pulse" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full blur-3xl transform -translate-x-32 translate-y-32 animate-pulse" />
                      </div>
                      
                      <div className="relative flex items-start gap-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md transform hover:scale-105 transition-transform">
                          <Zap className="h-10 w-10 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-obsidian dark:text-gray-100">
                              Ready to Master This Concept?
                            </h3>
                            <Badge variant="success" size="sm" className="animate-pulse bg-gradient-to-b from-green-600 to-green-700 text-white dark:from-green-700 dark:to-green-800 dark:text-green-100 px-2 py-1.25">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Interactive
                            </Badge>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-6 text-base leading-relaxed">
                            Our AI-powered Two-Stage Exercise System creates personalized challenges based on your interests, 
                            ensuring you truly understand and can apply what you've learned.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                              <div className="p-2 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-lg">
                                <Brain className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100">Stage 1: Initial Exercise</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Test core understanding with scenarios from your interests
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm">
                              <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-base text-gray-900 dark:text-gray-100">Stage 2: Advanced Exercise</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  Apply knowledge to complex real-world challenges
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Button
                              variant="primary"
                              size="lg"
                              onClick={handleStartExercise}
                              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-white font-semibold px-8"
                            >
                              <PlayCircle className="h-6 w-6 mr-2" />
                              Start Two-Stage Exercise
                            </Button>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Award className="h-5 w-5 text-yellow-500" />
                                <span className="font-medium">Earn mastery badge</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>~10-15 minutes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}

                  {/* Completed Section Celebration */}
                  {currentSectionStatus === 'completed' && (
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-1">
                            Section Mastered! 🎉
                          </h3>
                          <p className="text-green-800 dark:text-green-200">
                            You've successfully completed both exercises for this section. Great work!
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {/* Discussion Prompt */}
                  <Card className="p-4 bg-personal/10 dark:bg-personal/20 border-personal/30 dark:border-personal/40">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-personal dark:text-personal/80 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Reflection Question</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          How does this section relate to your initial question? What new insights have you gained?
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          Share Your Thoughts
                        </Button>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Right Sidebar - Sections */}
      <ThreadSectionsSidebar
        sections={thread.sections}
        selectedSection={selectedSection}
        onSelectSection={(sectionId) => {
          setSelectedSection(sectionId);
          setShowExercise(false);
        }}
        expandedSections={expandedSections}
        onToggleExpanded={toggleSectionExpanded}
      />

      {/* Floating Exercise CTA - Removed */}
    </div>
  );
};
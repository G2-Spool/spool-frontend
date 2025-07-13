import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/atoms/Card';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { 
  ArrowLeft, 
  Brain, 
  BarChart3,
  Award,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useThread } from '../hooks/useThread';
import { ThreadSectionsSidebar } from '../components/organisms/ThreadSectionsSidebar';
import { ChatExerciseInterface } from '../components/learning/ChatExerciseInterface';
import { ConceptPresentation } from '../components/learning/ConceptPresentation';
import { cn } from '../utils/cn';
import { MarkdownText } from '../utils/markdown';


export const ThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showExercise, setShowExercise] = useState(true);
  const [completedSections] = useState<Set<string>>(new Set());
  const [sectionProgress, setSectionProgress] = useState<Record<string, 'reading' | 'exercising' | 'completed'>>({});
  const [sidebarActiveTab, setSidebarActiveTab] = useState<'concepts' | 'glossary'>('concepts');
  const [newTerms, setNewTerms] = useState<string[]>([]);
  
  // Fetch thread data
  const { data: thread, isLoading, error } = useThread(threadId || '');
  

  
  // Set initial selected section and start exercise mode
  useEffect(() => {
    if (thread?.sections && thread.sections.length > 0 && !selectedSection) {
      const firstSectionId = thread.sections[0].id;
      setSelectedSection(firstSectionId);
      // Set the first section to exercising mode immediately
      setSectionProgress(prev => ({ ...prev, [firstSectionId]: 'exercising' }));
    }
  }, [thread, selectedSection]);
  
  const toggleSectionExpanded = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // const handleExerciseComplete = () => {
  //   if (selectedSection) {
  //     setCompletedSections(prev => new Set([...prev, selectedSection]));
  //     setSectionProgress(prev => ({ ...prev, [selectedSection]: 'completed' }));
  //     setShowExercise(false);
  //     
  //     // Auto-advance to next section if available
  //     const currentIndex = thread?.sections.findIndex(s => s.id === selectedSection) ?? -1;
  //     if (currentIndex >= 0 && currentIndex < (thread?.sections.length ?? 0) - 1) {
  //       setTimeout(() => {
  //         if (thread?.sections[currentIndex + 1]?.id) {
  //           setSelectedSection(thread.sections[currentIndex + 1].id);
  //         }
  //       }, 1500);
  //     }
  //   }
  // };

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
  
  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
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
            

            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{thread.sections.length} sections</span> matched your query
            </div>
          </div>
          
          {/* Exercise Interface */}
          {currentSection && (
            <div className="space-y-6 px-8 pb-8">
              <div className="space-y-6">
                {/* Concept Presentation */}
                <ConceptPresentation
                  conceptId={currentSection.id}
                  conceptTitle={currentSection.title}
                />
                
                {/* Chat Exercise Interface */}
                <div style={{ backgroundColor: '#2d3748' }} className="rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 rounded-lg">
                        <Brain className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Interactive Exercise</h2>
                        <p className="text-muted-foreground">Practice your understanding with AI-guided exercises</p>
                      </div>
                    </div>
                    
                    <ChatExerciseInterface
                      conceptId={currentSection.id}
                      conceptTitle={currentSection.title}
                      onSwitchToGlossary={() => setSidebarActiveTab('glossary')}
                      onNewTerm={(term) => setNewTerms(prev => [...prev, term])}
                    />
                  </div>
                </div>
            </div>
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
          // Set the new section to exercising mode immediately
          setSectionProgress(prev => ({ ...prev, [sectionId]: 'exercising' }));
          setShowExercise(true);
          setSidebarActiveTab('concepts'); // Start on concepts tab
        }}
        expandedSections={expandedSections}
        onToggleExpanded={toggleSectionExpanded}
        isExerciseMode={showExercise}
        newTerms={newTerms}
        onClearNewTerms={() => setNewTerms([])}
        activeTab={sidebarActiveTab}
        onSetActiveTab={setSidebarActiveTab}
      />

      {/* Floating Exercise CTA - Removed */}
    </div>
  );
};
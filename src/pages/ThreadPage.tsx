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
  Target
} from 'lucide-react';
import { useThread } from '../hooks/useThread';
import { ThreadSectionsSidebar } from '../components/organisms/ThreadSectionsSidebar';

export const ThreadPage: React.FC = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  
  // Fetch thread data
  const { data: thread, isLoading, error } = useThread(threadId || '');
  
  // Set initial selected section
  useEffect(() => {
    if (thread?.sections && thread.sections.length > 0 && !selectedSection) {
      setSelectedSection(thread.sections[0].id);
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
  
  if (isLoading) {
    return (
      <div className="flex h-screen">
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
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md text-center p-8">
          <h2 className="text-xl font-semibold text-error mb-2">Thread Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't find the thread you're looking for.
          </p>
          <Button onClick={() => navigate('/threads')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Card>
      </div>
    );
  }
  
  const currentSection = thread.sections.find(s => s.id === selectedSection);
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/threads')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            
            <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">
              Learning Thread
            </h1>
            
            {/* Analysis Summary */}
            <Card className="bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 p-4 mb-6">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-teal-600 dark:text-teal-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-teal-900 dark:text-teal-200 mb-1">Your Learning Focus</h3>
                  <p className="text-teal-800 dark:text-teal-300 text-sm">{thread.analysis.summary}</p>
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
          
          {/* Selected Section Content */}
          {currentSection && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-obsidian dark:text-gray-100 mb-2">
                      {currentSection.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{Math.round(currentSection.relevanceScore * 100)}% relevant</span>
                      </div>
                      {currentSection.estimatedMinutes && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{currentSection.estimatedMinutes} min</span>
                        </div>
                      )}
                      {currentSection.difficulty && (
                        <Badge variant="default" size="sm">
                          {currentSection.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Section Text Content */}
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {currentSection.text}
                  </p>
                </div>
                
                {/* Learning Tips */}
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">Learning Tip</h4>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        This section connects to key concepts in {thread.analysis.subjects.join(' and ')}. 
                        Try to relate this material to what you already know about these subjects.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Related Concepts */}
                {currentSection.conceptIds && currentSection.conceptIds.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-obsidian dark:text-gray-100 mb-3">
                      Related Concepts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSection.conceptIds.slice(0, 4).map((conceptId) => (
                        <div key={conceptId} className="cursor-pointer hover:scale-[1.02] transition-transform">
                          <Card className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                <span className="font-medium">Concept {conceptId.slice(-4)}</span>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Discussion Prompt */}
                <Card className="mt-6 p-4 bg-personal/10 dark:bg-personal/20 border-personal/30 dark:border-personal/40">
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
              </Card>
            </div>
          )}
        </div>
      </div>
      
      {/* Right Sidebar - Sections */}
      <ThreadSectionsSidebar
        sections={thread.sections}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
        expandedSections={expandedSections}
        onToggleExpanded={toggleSectionExpanded}
      />
    </div>
  );
};
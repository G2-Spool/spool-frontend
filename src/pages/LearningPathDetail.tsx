import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { Badge } from '../components/atoms/Badge';
import { Card } from '../components/atoms/Card';
import { ProgressBar } from '../components/molecules/ProgressBar';
import { ConceptCard } from '../components/molecules/ConceptCard';
import { ExerciseCard } from '../components/molecules/ExerciseCard';
import { 
  ArrowLeft, 
  Clock, 
  Trophy, 
  CheckCircle,
  Circle,
  Lock,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import type { LifeCategory } from '../types';
import { useLearningPath, useLearningPathProgress } from '../hooks/useLearningPath';
import { useQuery } from '@tanstack/react-query';

// Loading skeleton for learning path
const LearningPathSkeleton = () => (
  <div className="animate-pulse">
    <div className="mb-8">
      <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
      <div className="h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="flex items-center gap-6">
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded w-24"></div>
        <div className="h-5 bg-gray-200 rounded w-20"></div>
      </div>
      <div className="mt-6">
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 ml-4">
                <div className="h-5 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="lg:col-span-3">
        <Card>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-4/5"></div>
            <div className="h-40 bg-gray-200 rounded w-full"></div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

export const LearningPathDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [activeConceptIndex, setActiveConceptIndex] = useState(0);
  const [completedComponents, setCompletedComponents] = useState<Record<string, string[]>>({});
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // Fetch learning path data
  const { 
    data: learningPath, 
    isLoading: pathLoading, 
    error: pathError 
  } = useLearningPath(id || '');

  // Fetch learning path progress
  const { 
    data: progress, 
    isLoading: progressLoading 
  } = useLearningPathProgress(id || '');

  // Fetch sections and concepts for this learning path
  const { 
    data: sections = [], 
    isLoading: sectionsLoading 
  } = useQuery({
    queryKey: ['learningPath', id, 'sections'],
    queryFn: async () => {
      // This would typically fetch sections from your API
      // For now, returning mock data structure
      // Replace with actual API call
      return mockSectionsForPath(id);
    },
    enabled: !!id,
  });

  const isLoading = pathLoading || progressLoading || sectionsLoading;
  const error = pathError;

  const activeSection = sections[activeSectionIndex];
  const activeConcept = activeSection?.concepts[activeConceptIndex];

  const handleComponentComplete = (componentId: string) => {
    const conceptId = activeConcept.id;
    setCompletedComponents(prev => ({
      ...prev,
      [conceptId]: [...(prev[conceptId] || []), componentId],
    }));
  };

  const handleExerciseComplete = (exerciseId: string, response: string) => {
    // In a real app, this would submit to the backend
    console.log('Exercise completed:', exerciseId, response);
    setCompletedExercises(prev => ({
      ...prev,
      [exerciseId]: true,
    }));
  };

  const isConceptCompleted = (concept: any) => {
    const components = completedComponents[concept.id] || [];
    const exercisesCompleted = 
      completedExercises[concept.exercises?.initial?.id] && 
      completedExercises[concept.exercises?.articulation?.id];
    return components.length === 3 && exercisesCompleted;
  };

  const areConceptComponentsCompleted = (concept: any) => {
    const components = completedComponents[concept.id] || [];
    return components.length === 3;
  };

  const isConceptLocked = (sectionIndex: number, conceptIndex: number) => {
    if (sectionIndex === 0 && conceptIndex === 0) return false;
    
    if (conceptIndex > 0) {
      const previousConcept = sections[sectionIndex].concepts[conceptIndex - 1];
      return !isConceptCompleted(previousConcept);
    }
    
    if (sectionIndex > 0) {
      const previousSection = sections[sectionIndex - 1];
      const lastConcept = previousSection.concepts[previousSection.concepts.length - 1];
      return !isConceptCompleted(lastConcept);
    }
    
    return false;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LearningPathSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-700 mb-2">Failed to load learning path</h2>
          <p className="text-red-600 mb-4">Please try again or contact support if the problem persists.</p>
          <Button variant="primary" onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  if (!learningPath || sections.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-8 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Learning path not found</h2>
          <p className="text-gray-600 mb-4">This learning path may have been removed or is not available.</p>
          <Button variant="primary" onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/courses')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-obsidian dark:text-gray-100 mb-2">
              {learningPath.subject || 'Learning Path'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Continue your learning journey
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {Math.round((learningPath.estimatedCompletionDate ? 
                    new Date(learningPath.estimatedCompletionDate).getTime() - Date.now() : 0) / (1000 * 60 * 60 * 24))} days left
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {progress?.pointsEarned || 0} points earned
                </span>
              </div>
              <Badge variant="primary" size="sm">
                {learningPath.status}
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Overall Progress */}
        <div className="mt-6">
          <ProgressBar
            value={(learningPath.conceptsCompleted / learningPath.conceptsTotal) * 100}
            label={`${learningPath.conceptsCompleted} of ${learningPath.conceptsTotal} concepts completed`}
            showPercentage
            variant="default"
            size="lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Section Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-semibold text-obsidian dark:text-gray-100 mb-4">Course Sections</h3>
            <div className="space-y-4">
              {sections.map((section: any, sectionIndex: number) => (
                <div key={section.id}>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {sectionIndex + 1}. {section.title}
                  </h4>
                  <div className="space-y-1 ml-4">
                    {section.concepts.map((concept: any, conceptIndex: number) => {
                      const isCompleted = isConceptCompleted(concept);
                      const isLocked = isConceptLocked(sectionIndex, conceptIndex);
                      const isActive = sectionIndex === activeSectionIndex && conceptIndex === activeConceptIndex;

                      return (
                        <button
                          key={concept.id}
                          onClick={() => {
                            if (!isLocked) {
                              setActiveSectionIndex(sectionIndex);
                              setActiveConceptIndex(conceptIndex);
                            }
                          }}
                          disabled={isLocked}
                          className={`w-full text-left p-2 rounded-md transition-all duration-normal flex items-center gap-2 text-sm ${
                            isActive
                              ? 'bg-teal-50 dark:bg-teal-900/30 border border-teal-300 dark:border-teal-600'
                              : isLocked
                              ? 'bg-gray-50 dark:bg-gray-800 cursor-not-allowed opacity-50'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                          ) : isLocked ? (
                            <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          )}
                          <span className="flex-1 truncate text-gray-700 dark:text-gray-300">{concept.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <h3 className="font-semibold text-obsidian dark:text-gray-100 mb-4">Your Progress</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Time Spent</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {Math.round((progress?.totalTimeSpent || 0) / 60)} hours
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Points Earned</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {progress?.pointsEarned || 0} / {progress?.totalPoints || 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Mastery Score</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {Math.round(learningPath.averageMasteryScore || 0)}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Concept Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeConcept && (
            <>
              {/* Section Header */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Section {activeSectionIndex + 1}</p>
                <h2 className="text-2xl font-bold text-obsidian dark:text-gray-100">{activeSection.title}</h2>
              </div>

              {/* Current Concept */}
              <ConceptCard
                id={activeConcept.id}
                title={activeConcept.title}
                description={activeConcept.description}
                category={(activeConcept.category || 'personal') as LifeCategory}
                components={activeConcept.components}
                completedComponents={completedComponents[activeConcept.id] || []}
                onComponentComplete={handleComponentComplete}
              />

              {/* Exercises - Only show if all components are completed */}
              {areConceptComponentsCompleted(activeConcept) && activeConcept.exercises && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-obsidian dark:text-gray-100">Exercises</h3>
                  
                  {/* Initial Exercise */}
                  <ExerciseCard
                    title={activeConcept.exercises.initial.title}
                    description={activeConcept.exercises.initial.description}
                    category={(activeConcept.category || 'personal') as LifeCategory}
                    type="initial"
                    onSubmit={(response) => handleExerciseComplete(activeConcept.exercises.initial.id, response)}
                    isCompleted={completedExercises[activeConcept.exercises.initial.id]}
                  />

                  {/* Articulation Exercise - Only show if initial is completed */}
                  {completedExercises[activeConcept.exercises.initial.id] && (
                    <ExerciseCard
                      title={activeConcept.exercises.articulation.title}
                      description={activeConcept.exercises.articulation.description}
                      category={(activeConcept.category || 'personal') as LifeCategory}
                      type="articulation"
                      onSubmit={(response) => handleExerciseComplete(activeConcept.exercises.articulation.id, response)}
                      isCompleted={completedExercises[activeConcept.exercises.articulation.id]}
                    />
                  )}
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => {
                if (activeConceptIndex > 0) {
                  setActiveConceptIndex(activeConceptIndex - 1);
                } else if (activeSectionIndex > 0) {
                  const prevSection = sections[activeSectionIndex - 1];
                  setActiveSectionIndex(activeSectionIndex - 1);
                  setActiveConceptIndex(prevSection.concepts.length - 1);
                }
              }}
              disabled={activeSectionIndex === 0 && activeConceptIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Concept
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const currentSection = sections[activeSectionIndex];
                if (activeConceptIndex < currentSection.concepts.length - 1) {
                  setActiveConceptIndex(activeConceptIndex + 1);
                } else if (activeSectionIndex < sections.length - 1) {
                  setActiveSectionIndex(activeSectionIndex + 1);
                  setActiveConceptIndex(0);
                } else {
                  navigate('/courses');
                }
              }}
              disabled={!isConceptCompleted(activeConcept)}
            >
              {activeSectionIndex === sections.length - 1 && 
               activeConceptIndex === sections[activeSectionIndex].concepts.length - 1 
                ? 'Complete Path' 
                : 'Next Concept'}
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Temporary mock function - replace with actual API call
function mockSectionsForPath(_pathId: string | undefined) {
  // This would be replaced by actual API call to fetch sections and concepts
  return [
    {
      id: 'section-1',
      title: 'Getting Started',
      description: 'Learn the fundamentals',
      concepts: [
        {
          id: 'concept-1-1',
          title: 'Introduction to the Topic',
          description: 'Discover what this is all about and why it matters',
          category: 'personal',
          components: {
            hookRelevance: {
              id: 'comp-1-1-1',
              title: 'Why This Matters to You',
              type: 'hook' as const,
              contentType: 'video' as const,
              duration: '5 min',
              url: '#',
            },
            showMeExamples: {
              id: 'comp-1-1-2',
              title: 'Real-World Examples',
              type: 'examples' as const,
              contentType: 'interactive' as const,
              duration: '10 min',
              url: '#',
            },
            whatAndHow: {
              id: 'comp-1-1-3',
              title: 'Core Concepts Explained',
              type: 'what-how' as const,
              contentType: 'article' as const,
              duration: '15 min',
              url: '#',
            },
          },
          exercises: {
            initial: {
              id: 'exercise-1-1-1',
              title: 'Apply Your Understanding',
              description: 'Show what you learned by solving this problem.',
            },
            articulation: {
              id: 'exercise-1-1-2',
              title: 'Explain Your Thinking',
              description: 'Describe how you would apply this concept in your own life.',
            },
          },
        },
      ],
    },
  ];
}
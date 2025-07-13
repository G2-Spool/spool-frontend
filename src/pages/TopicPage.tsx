/**
 * TopicPage Component
 * 
 * Displays a topic overview with course sections sidebar navigation.
 * Shows course introduction, prerequisites, and section progression.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { ConceptList } from '../components/organisms/ConceptList';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle, 
  Circle,
  Clock,
} from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  locked: boolean;
  progress: number;
}

interface Section {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current?: boolean;
  icon?: React.ReactNode;
  concepts?: Concept[];
  content?: string;
}

interface TopicData {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  totalSections: number;
  currentSection: number;
  prerequisites: string;
  duration: string;
  credits: string;
}

// Mock data for different topics
const getTopicData = (topicId: string): TopicData => {
  const topics: Record<string, TopicData> = {
    'college-algebra': {
      id: 'college-algebra',
      title: 'College Algebra',
      description: 'Course introduction and overview',
      currentSection: 2,
      totalSections: 9,
      prerequisites: 'Intermediate Algebra or equivalent',
      duration: '16 weeks',
      credits: '3 credit hours',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          description: 'Course introduction and overview',
          completed: false,
          current: true,
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: 'prerequisites',
          title: 'Prerequisites',
          description: 'Fundamental algebraic concepts and skills',
          completed: true,
          icon: <CheckCircle className="h-4 w-4" />,
          concepts: [
            {
              id: 'real-numbers-algebra-essentials',
              title: 'Real Numbers: Algebra Essentials',
              description: 'Properties of real numbers, number systems, and algebraic operations',
              completed: true,
              locked: false,
              progress: 100
            },
            {
              id: 'exponents-scientific-notation',
              title: 'Exponents and Scientific Notation',
              description: 'Rules of exponents and scientific notation applications',
              completed: true,
              locked: false,
              progress: 100
            },
            {
              id: 'radicals-rational-exponents',
              title: 'Radicals and Rational Exponents',
              description: 'Working with radicals and rational exponents',
              completed: true,
              locked: false,
              progress: 100
            },
            {
              id: 'polynomials',
              title: 'Polynomials',
              description: 'Polynomial operations and properties',
              completed: true,
              locked: false,
              progress: 100
            },
            {
              id: 'factoring-polynomials',
              title: 'Factoring Polynomials',
              description: 'Techniques for factoring various polynomial expressions',
              completed: true,
              locked: false,
              progress: 100
            },
            {
              id: 'rational-expressions',
              title: 'Rational Expressions',
              description: 'Simplifying and operating with rational expressions',
              completed: true,
              locked: false,
              progress: 100
            }
          ]
        },
        {
          id: 'equations-inequalities',
          title: 'Equations and Inequalities',
          description: 'Solving equations and inequalities in one variable',
          completed: false,
          icon: <Circle className="h-4 w-4" />,
          concepts: [
            {
              id: 'linear-equations-one-variable',
              title: 'Linear Equations in One Variable',
              description: 'Solving basic linear equations step by step',
              completed: false,
              locked: false,
              progress: 0
            },
            {
              id: 'equations-with-fractions',
              title: 'Equations with Fractions',
              description: 'Solving equations containing fractional terms',
              completed: false,
              locked: true,
              progress: 0
            },
            {
              id: 'literal-equations',
              title: 'Literal Equations and Formulas',
              description: 'Solving equations for specified variables',
              completed: false,
              locked: true,
              progress: 0
            },
            {
              id: 'quadratic-equations',
              title: 'Quadratic Equations',
              description: 'Solving quadratic equations using various methods',
              completed: false,
              locked: true,
              progress: 0
            },
            {
              id: 'linear-inequalities',
              title: 'Linear Inequalities',
              description: 'Solving and graphing linear inequalities',
              completed: false,
              locked: true,
              progress: 0
            },
            {
              id: 'compound-inequalities',
              title: 'Compound Inequalities',
              description: 'Working with compound inequality statements',
              completed: false,
              locked: true,
              progress: 0
            }
          ]
        },
        {
          id: 'functions',
          title: 'Functions',
          description: 'Introduction to functions and their properties',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        },
        {
          id: 'linear-functions',
          title: 'Linear Functions',
          description: 'Properties and applications of linear functions',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        },
        {
          id: 'polynomial-rational',
          title: 'Polynomial and Rational Functions',
          description: 'Advanced study of polynomial and rational functions',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        },
        {
          id: 'exponential-logarithmic',
          title: 'Exponential and Logarithmic Functions',
          description: 'Exponential and logarithmic functions and their applications',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        },
        {
          id: 'systems-equations',
          title: 'Systems of Equations and Inequalities',
          description: 'Solving systems of equations and inequalities',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        }
      ]
    },
    'statistics': {
      id: 'statistics',
      title: 'Introductory Statistics',
      description: 'Learn statistical analysis and data interpretation',
      currentSection: 1,
      totalSections: 13,
      prerequisites: 'Basic algebra',
      duration: '16 weeks',
      credits: '3 credit hours',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          description: 'Course introduction and overview',
          completed: false,
          current: true,
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: 'data-collection',
          title: 'Data Collection',
          description: 'Methods of collecting and organizing data',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        }
      ]
    },
    'biology': {
      id: 'biology',
      title: 'Biology',
      description: 'Study living organisms and their interactions with the environment',
      currentSection: 1,
      totalSections: 47,
      prerequisites: 'High school chemistry',
      duration: '16 weeks',
      credits: '4 credit hours',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          description: 'Course introduction and overview',
          completed: false,
          current: true,
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: 'cell-structure',
          title: 'Cell Structure and Function',
          description: 'Basic components and functions of cells',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        }
      ]
    },
    'anatomy': {
      id: 'anatomy',
      title: 'Anatomy and Physiology',
      description: 'Learn about the structure and organization of the human body',
      currentSection: 1,
      totalSections: 28,
      prerequisites: 'High school biology',
      duration: '16 weeks',
      credits: '4 credit hours',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          description: 'Course introduction and overview',
          completed: false,
          current: true,
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: 'body-systems',
          title: 'Body Systems Overview',
          description: 'Introduction to major body systems',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        }
      ]
    },
    'writing': {
      id: 'writing',
      title: 'Writing Guide',
      description: 'Develop your writing skills and communication abilities',
      currentSection: 1,
      totalSections: 20,
      prerequisites: 'Basic reading comprehension',
      duration: '16 weeks',
      credits: '3 credit hours',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          description: 'Course introduction and overview',
          completed: false,
          current: true,
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: 'writing-process',
          title: 'The Writing Process',
          description: 'Understanding the stages of effective writing',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        }
      ]
    },
    'philosophy': {
      id: 'philosophy',
      title: 'Introduction to Philosophy',
      description: 'Explore fundamental questions about existence and knowledge',
      currentSection: 1,
      totalSections: 12,
      prerequisites: 'Critical thinking skills',
      duration: '16 weeks',
      credits: '3 credit hours',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          description: 'Course introduction and overview',
          completed: false,
          current: true,
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: 'what-is-philosophy',
          title: 'What is Philosophy?',
          description: 'Defining philosophy and its branches',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        }
      ]
    },
    'world-history': {
      id: 'world-history',
      title: 'World History, Volume 2: from 1400',
      description: 'Journey through major events and civilizations',
      currentSection: 1,
      totalSections: 15,
      prerequisites: 'Basic historical knowledge',
      duration: '16 weeks',
      credits: '3 credit hours',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          description: 'Course introduction and overview',
          completed: false,
          current: true,
          icon: <BookOpen className="h-4 w-4" />
        },
        {
          id: 'renaissance',
          title: 'The Renaissance',
          description: 'Cultural rebirth in Europe',
          completed: false,
          icon: <Circle className="h-4 w-4" />
        }
      ]
    }
  };

  return topics[topicId] || topics['college-algebra'];
};

export const TopicPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  
  const topicData = useMemo(() => getTopicData(topicId || 'college-algebra'), [topicId]);
  const currentSection = topicData.sections.find(s => s.id === selectedSection);

  useEffect(() => {
    // Set initial selected section to current section if available
    const currentSectionData = topicData.sections.find(s => s.current);
    if (currentSectionData) {
      setSelectedSection(currentSectionData.id);
    }
  }, [topicId, topicData]); // Only run when topicId changes (topicData is memoized)

  const handleBackToClasses = () => {
    navigate('/threads');
  };

  const handleStartLearning = () => {
    navigate(`/learn/${topicId}`);
  };

  const handleConceptClick = (conceptId: string) => {
    console.log('Concept clicked:', conceptId);
    // Navigate to concept learning page
    navigate(`/topic/${topicId}/learn/${conceptId}`);
  };

  const getOverviewContent = () => {
    const topics: Record<string, string> = {
      'college-algebra': `College Algebra is a fundamental course that builds upon basic algebraic concepts to prepare students for more advanced mathematics courses.

This course covers essential topics including functions, equations, inequalities, and graphing. Students will develop problem-solving skills and mathematical reasoning abilities.

The course emphasizes practical applications of algebraic concepts in real-world scenarios, helping students understand the relevance of mathematics in their daily lives and future careers.

By the end of this course, you'll have a solid foundation in algebraic thinking and be prepared for calculus and other advanced mathematics courses.`,
      
      'statistics': `Introductory Statistics provides a comprehensive foundation in statistical concepts and methods. Students will learn to collect, organize, analyze, and interpret data.

This course covers descriptive statistics, probability, hypothesis testing, and statistical inference. Students will develop critical thinking skills for analyzing statistical information.

The course emphasizes real-world applications and uses technology to enhance learning and problem-solving capabilities.`,
      
      'biology': `Biology explores the fundamental principles of life, from molecular processes to ecosystem interactions. Students will study cell structure, genetics, evolution, and biodiversity.

This course provides hands-on laboratory experiences and emphasizes scientific inquiry and critical thinking skills.

Students will develop an understanding of biological processes and their applications in medicine, biotechnology, and environmental science.`,
      
      'anatomy': `Anatomy and Physiology examines the structure and function of the human body. Students will study all major body systems and their interactions.

This course combines theoretical knowledge with practical applications, preparing students for careers in healthcare and related fields.

Laboratory activities include dissection, microscopy, and physiological experiments to enhance understanding of human biology.`,

      'writing': `Writing Guide is a comprehensive course designed to develop effective writing skills across various contexts and purposes. Students will learn the fundamental principles of clear, persuasive communication.

This course covers the complete writing process, from brainstorming and organizing ideas to drafting, revising, and editing. Students will practice various writing formats including essays, reports, and creative pieces.

Emphasis is placed on developing critical thinking skills, proper grammar and mechanics, and adapting writing style to different audiences and purposes.

By the end of this course, students will have the confidence and skills to communicate effectively in academic, professional, and personal contexts.`,

      'philosophy': `Introduction to Philosophy explores fundamental questions about existence, knowledge, ethics, and reality. Students will examine the thoughts and arguments of major philosophers throughout history.

This course develops critical thinking skills through the analysis of philosophical texts and concepts. Students will learn to construct logical arguments and evaluate different philosophical positions.

Topics include metaphysics, epistemology, ethics, political philosophy, and the philosophy of mind. Students will engage with both historical and contemporary philosophical issues.

The course emphasizes the relevance of philosophical thinking to everyday life and current social issues.`,

      'world-history': `World History, Volume 2: from 1400 surveys major global developments from the Renaissance to the present day. Students will explore political, social, economic, and cultural changes across different civilizations.

This course examines the interconnected nature of world history, including the rise of global trade, colonialism, industrialization, and modern globalization.

Students will develop skills in historical analysis, critical thinking, and understanding of diverse cultural perspectives. The course emphasizes the importance of understanding historical context for contemporary issues.

Topics include the Renaissance, Age of Exploration, Scientific Revolution, Enlightenment, Industrial Revolution, World Wars, and the modern global era.`
    };

    return topics[topicId || 'college-algebra'] || topics['college-algebra'];
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold">Course Sections</h2>
          </div>
          <p className="text-sm text-gray-400">
            Section {topicData.currentSection} of {topicData.totalSections}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {topicData.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`w-full p-4 text-left border-b border-gray-700 hover:bg-gray-700 transition-colors ${
                selectedSection === section.id 
                  ? 'bg-teal-600 border-teal-500' 
                  : section.completed 
                    ? 'bg-gray-700' 
                    : 'bg-gray-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${
                  section.completed 
                    ? 'text-green-400' 
                    : selectedSection === section.id 
                      ? 'text-white' 
                      : 'text-gray-400'
                }`}>
                  {section.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium ${
                    selectedSection === section.id ? 'text-white' : 'text-gray-200'
                  }`}>
                    {section.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    selectedSection === section.id ? 'text-gray-100' : 'text-gray-400'
                  }`}>
                    {section.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-8">
          <Button
            variant="ghost"
            onClick={handleBackToClasses}
            className="mb-4 text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Classes
          </Button>
          <h1 className="text-4xl font-bold mb-2">{topicData.title}</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentSection && (
            <div className="max-w-4xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {currentSection.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {currentSection.description}
                </p>
              </div>

              {selectedSection === 'overview' && (
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {getOverviewContent()}
                    </p>
                  </div>
                  
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      Course Information
                    </h3>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                      <p><strong>Prerequisites:</strong> {topicData.prerequisites}</p>
                      <p><strong>Duration:</strong> {topicData.duration}</p>
                      <p><strong>Credits:</strong> {topicData.credits}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      size="lg"
                      onClick={handleStartLearning}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      Start Learning
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setSelectedSection('prerequisites')}
                    >
                      View Prerequisites
                    </Button>
                  </div>
                </div>
              )}

              {selectedSection === 'prerequisites' && (
                <div className="space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      Before starting this course, you should have a solid understanding of fundamental algebraic concepts and skills. This includes working with variables, solving basic equations, and understanding mathematical operations.
                    </p>
                  </div>
                  
                  {currentSection?.concepts && currentSection.concepts.length > 0 && (
                    <ConceptList
                      concepts={currentSection.concepts}
                      onConceptClick={handleConceptClick}
                    />
                  )}
                </div>
              )}

              {selectedSection !== 'overview' && selectedSection !== 'prerequisites' && (
                <div className="space-y-6">
                  {currentSection?.concepts && currentSection.concepts.length > 0 ? (
                    <ConceptList
                      concepts={currentSection.concepts}
                      onConceptClick={handleConceptClick}
                    />
                  ) : (
                    <>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          This section covers {currentSection?.title.toLowerCase()}. The content for this section will be available as you progress through the course.
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-3">
                          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                            Section Coming Soon
                          </h3>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300">
                          This section will be unlocked as you complete the previous sections in order.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
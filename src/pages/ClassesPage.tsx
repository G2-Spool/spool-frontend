/**
 * ClassesPage Component
 * 
 * Displays "My Classes" with colorful topic cards organized by subject.
 * Matches the exact design from Spool-GitHub with gradient cards and carousels.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SubjectCarousel } from '../components/organisms/SubjectCarousel';

// Utility function to calculate topic stats
const calculateTopicStats = (topicId: string) => {
  const topicStatsMap: Record<string, { sections: number; concepts: number }> = {
    "college-algebra": { sections: 9, concepts: 57 },
    "statistics": { sections: 13, concepts: 80 },
    "writing": { sections: 20, concepts: 163 },
    "philosophy": { sections: 12, concepts: 53 },
    "world-history": { sections: 15, concepts: 60 },
    "biology": { sections: 47, concepts: 208 },
    "anatomy": { sections: 28, concepts: 169 }
  }
  
  return topicStatsMap[topicId] || { sections: 0, concepts: 0 }
}

// Function to calculate progress
const calculateTopicProgress = (topicId: string): number => {
  const progressMap: Record<string, number> = {
    "college-algebra": 12,
    "statistics": 0,
    "writing": 0,
    "philosophy": 0,
    "world-history": 0,
    "biology": 0,
    "anatomy": 0
  }
  
  return progressMap[topicId] || 0
}

const subjectsData = [
  {
    title: "Mathematics",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    topics: [
      {
        id: "college-algebra",
        title: "College Algebra",
        description: "Master algebraic concepts and problem-solving techniques",
        ...calculateTopicStats("college-algebra"),
        progress: calculateTopicProgress("college-algebra")
      },
      {
        id: "statistics",
        title: "Introductory Statistics",
        description: "Learn statistical analysis and data interpretation",
        ...calculateTopicStats("statistics"),
        progress: calculateTopicProgress("statistics")
      }
    ]
  },
  {
    title: "Humanities",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    topics: [
      {
        id: "writing",
        title: "Writing Guide",
        description: "Develop your writing skills and communication abilities",
        ...calculateTopicStats("writing"),
        progress: calculateTopicProgress("writing")
      },
      {
        id: "philosophy",
        title: "Introduction to Philosophy",
        description: "Explore fundamental questions about existence and knowledge",
        ...calculateTopicStats("philosophy"),
        progress: calculateTopicProgress("philosophy")
      },
      {
        id: "world-history",
        title: "World History, Volume 2: from 1400",
        description: "Journey through major events and civilizations",
        ...calculateTopicStats("world-history"),
        progress: calculateTopicProgress("world-history")
      }
    ]
  },
  {
    title: "Science",
    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    topics: [
      {
        id: "biology",
        title: "Biology",
        description: "Study living organisms and their interactions with the environment",
        ...calculateTopicStats("biology"),
        progress: calculateTopicProgress("biology")
      },
      {
        id: "anatomy",
        title: "Anatomy and Physiology",
        description: "Learn about the structure and organization of the human body",
        ...calculateTopicStats("anatomy"),
        progress: calculateTopicProgress("anatomy")
      }
    ]
  }
]

export const ClassesPage: React.FC = () => {
  const navigate = useNavigate()

  const handleTopicClick = (topicId: string) => {
    navigate(`/topic/${topicId}`)
  }

  const handlePlayClick = (topicId: string) => {
    navigate(`/topic/${topicId}`)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">My Classes</h1>
          <p className="text-gray-600 text-lg">
            Explore your subjects and track your learning progress
          </p>
        </div>

        <div className="space-y-16">
          {subjectsData.map((subject) => (
            <SubjectCarousel
              key={subject.title}
              title={subject.title}
              topics={subject.topics}
              color={subject.color}
              onTopicClick={handleTopicClick}
              onPlayClick={handlePlayClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
} 
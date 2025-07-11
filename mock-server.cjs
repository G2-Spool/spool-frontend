const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all origins during development
app.use(cors());
app.use(express.json());

// Mock textbooks data
const mockTextbooks = [
  {
    id: '1',
    title: 'Introduction to Mathematics',
    subject: 'Mathematics',
    gradeLevel: '9',
    description: 'A comprehensive introduction to high school mathematics covering algebra, geometry, and basic calculus.',
    publisher: 'Academic Press',
    publishYear: 2023,
    totalChapters: 12,
    estimatedHours: 120,
    topics: ['Algebra', 'Geometry', 'Trigonometry', 'Pre-Calculus']
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    subject: 'Physics',
    gradeLevel: '10',
    description: 'Explore the fundamental concepts of physics including mechanics, thermodynamics, and electromagnetism.',
    publisher: 'Science Publishers',
    publishYear: 2023,
    totalChapters: 10,
    estimatedHours: 100,
    topics: ['Mechanics', 'Thermodynamics', 'Waves', 'Electricity']
  },
  {
    id: '3',
    title: 'Chemistry Essentials',
    subject: 'Chemistry',
    gradeLevel: '10',
    description: 'Master the essential concepts of chemistry from atomic structure to chemical reactions.',
    publisher: 'ChemEd Publications',
    publishYear: 2023,
    totalChapters: 14,
    estimatedHours: 110,
    topics: ['Atomic Structure', 'Chemical Bonds', 'Reactions', 'Organic Chemistry']
  },
  {
    id: '4',
    title: 'Biology: Life Sciences',
    subject: 'Biology',
    gradeLevel: '9',
    description: 'Discover the wonders of life sciences from cells to ecosystems.',
    publisher: 'BioLearn Press',
    publishYear: 2023,
    totalChapters: 15,
    estimatedHours: 130,
    topics: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology']
  },
  {
    id: '5',
    title: 'World History',
    subject: 'History',
    gradeLevel: '9',
    description: 'Journey through world history from ancient civilizations to modern times.',
    publisher: 'Historical Press',
    publishYear: 2023,
    totalChapters: 20,
    estimatedHours: 150,
    topics: ['Ancient Civilizations', 'Medieval Period', 'Renaissance', 'Modern History']
  },
  {
    id: '6',
    title: 'English Literature',
    subject: 'English',
    gradeLevel: '10',
    description: 'Explore classic and contemporary literature with in-depth analysis.',
    publisher: 'Literary House',
    publishYear: 2023,
    totalChapters: 18,
    estimatedHours: 140,
    topics: ['Poetry', 'Drama', 'Novels', 'Literary Analysis']
  },
  {
    id: '7',
    title: 'Computer Science Basics',
    subject: 'Computer Science',
    gradeLevel: '10',
    description: 'Introduction to programming, algorithms, and computational thinking.',
    publisher: 'TechEd Publishers',
    publishYear: 2023,
    totalChapters: 12,
    estimatedHours: 100,
    topics: ['Programming', 'Algorithms', 'Data Structures', 'Web Development']
  },
  {
    id: '8',
    title: 'Environmental Science',
    subject: 'Science',
    gradeLevel: '11',
    description: 'Understanding our environment and the impact of human activities.',
    publisher: 'EcoLearn Press',
    publishYear: 2023,
    totalChapters: 10,
    estimatedHours: 90,
    topics: ['Ecosystems', 'Climate Change', 'Conservation', 'Sustainability']
  }
];

// Mock courses data
const mockCourses = {
  items: [
    {
      id: 'course-1',
      title: 'Advanced Mathematics',
      description: 'Deep dive into advanced mathematical concepts',
      category: 'career',
      enrolled: true,
      totalConcepts: 50,
      completedConcepts: 12,
      estimatedHours: 40,
      points: 500
    },
    {
      id: 'course-2',
      title: 'Creative Writing',
      description: 'Express yourself through various forms of writing',
      category: 'personal',
      enrolled: true,
      totalConcepts: 30,
      completedConcepts: 8,
      estimatedHours: 25,
      points: 300
    }
  ],
  total: 2,
  hasMore: false
};

// Routes
app.get('/api/content/books', (req, res) => {
  console.log('GET /api/content/books - Returning mock textbooks');
  res.json(mockTextbooks);
});

app.get('/api/content/books/:id', (req, res) => {
  const textbook = mockTextbooks.find(t => t.id === req.params.id);
  if (textbook) {
    res.json(textbook);
  } else {
    res.status(404).json({ error: 'Textbook not found' });
  }
});

app.get('/api/courses', (req, res) => {
  console.log('GET /api/courses - Returning mock courses');
  res.json(mockCourses);
});

app.get('/api/courses/search', (req, res) => {
  console.log('GET /api/courses/search - Returning empty results');
  res.json([]);
});

// Learning paths endpoint
app.get('/api/learning-paths', (req, res) => {
  console.log('GET /api/learning-paths - Returning mock learning paths');
  res.json({
    items: [
      {
        id: 'path-1',
        title: 'Mathematics Mastery',
        description: 'Master mathematical concepts from basics to advanced',
        category: 'academic',
        totalConcepts: 120,
        completedConcepts: 45,
        estimatedHours: 80,
        subjects: ['Algebra', 'Geometry', 'Calculus'],
        enrolled: true
      },
      {
        id: 'path-2',
        title: 'Science Explorer',
        description: 'Explore the wonders of physics, chemistry, and biology',
        category: 'academic',
        totalConcepts: 150,
        completedConcepts: 30,
        estimatedHours: 100,
        subjects: ['Physics', 'Chemistry', 'Biology'],
        enrolled: false
      }
    ],
    total: 2,
    hasMore: false
  });
});

// Analytics endpoint for student stats
app.get('/api/analytics/progress', (req, res) => {
  console.log('GET /api/analytics/progress - Returning mock analytics');
  res.json({
    studentStats: {
      totalPoints: 1250,
      rank: 42,
      streak: 7,
      conceptsCompleted: 75,
      hoursSpent: 32.5,
      averageScore: 85.3
    },
    weeklyProgress: [
      { day: 'Mon', concepts: 5, hours: 2.5 },
      { day: 'Tue', concepts: 8, hours: 3.0 },
      { day: 'Wed', concepts: 6, hours: 2.0 },
      { day: 'Thu', concepts: 7, hours: 3.5 },
      { day: 'Fri', concepts: 9, hours: 4.0 },
      { day: 'Sat', concepts: 4, hours: 1.5 },
      { day: 'Sun', concepts: 3, hours: 1.0 }
    ],
    subjectBreakdown: [
      { subject: 'Mathematics', percentage: 35 },
      { subject: 'Physics', percentage: 25 },
      { subject: 'Chemistry', percentage: 20 },
      { subject: 'Biology', percentage: 20 }
    ]
  });
});

// Interview endpoints
const interviewSessions = new Map();

app.post('/api/interview/start', (req, res) => {
  console.log('POST /api/interview/start - Starting mock interview session');
  console.log('Request body:', req.body);
  
  const sessionId = `session-${Date.now()}`;
  const { mode = 'interests', purpose, studentId } = req.body;
  
  const newSession = {
    sessionId,
    status: 'active',
    startTime: new Date().toISOString(),
    messages: [],
    topic: req.body.topic || 'Learning Interests Discovery',
    mode,
    purpose,
    studentId,
    messageCount: 0
  };
  
  interviewSessions.set(sessionId, newSession);
  
  res.json({
    sessionId,
    status: 'active',
    topic: newSession.topic,
    mode,
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      }
    ]
  });
});

app.post('/api/interview/:sessionId/message', (req, res) => {
  const { sessionId } = req.params;
  const { message, mode } = req.body;
  
  console.log(`POST /api/interview/${sessionId}/message - Processing message`);
  console.log('Mode:', mode || 'interests');
  
  const session = interviewSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  // Add user message
  session.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  });
  
  session.messageCount++;
  
  // Generate contextual AI responses based on keywords
  let responseContent = "That's interesting! Tell me more about what specifically interests you in that area.";
  let isComplete = false;
  let threadId = null;
  let threadCreated = false;
  let interests = [];
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('math') || lowerMessage.includes('mathematics')) {
    responseContent = "Mathematics is fascinating! Are you more interested in pure mathematics like algebra and geometry, or applied mathematics like statistics and calculus? What kind of math problems do you enjoy solving?";
  } else if (lowerMessage.includes('science')) {
    responseContent = "Science opens up so many possibilities! Are you drawn to experimental sciences like chemistry and physics, or more observational sciences like astronomy and biology? What scientific phenomena capture your curiosity?";
  } else if (lowerMessage.includes('history')) {
    responseContent = "History helps us understand our world! Do you prefer ancient civilizations, modern history, or perhaps specific regions or time periods? What historical events or figures inspire you?";
  } else if (lowerMessage.includes('programming') || lowerMessage.includes('coding') || lowerMessage.includes('computer')) {
    responseContent = "Technology is shaping our future! Are you interested in web development, mobile apps, artificial intelligence, or perhaps game development? What would you like to create with code?";
  } else if (lowerMessage.includes('art') || lowerMessage.includes('music') || lowerMessage.includes('creative')) {
    responseContent = "Creative expression is wonderful! Do you prefer visual arts, performing arts, or digital creativity? What inspires your artistic side?";
  } else if (lowerMessage.includes('language') || lowerMessage.includes('literature')) {
    responseContent = "Language and literature connect us across cultures! Are you interested in creative writing, foreign languages, or literary analysis? What stories or languages fascinate you?";
  }
  
  const aiResponse = {
    role: 'assistant',
    content: responseContent,
    timestamp: new Date().toISOString()
  };
  
  session.messages.push(aiResponse);
  
  // Simulate completion and thread creation for thread mode
  if ((mode === 'thread' || session.mode === 'thread') && session.messageCount >= 2) {
    isComplete = true;
    threadId = `thread-${Date.now()}`;
    threadCreated = true;
    
    // Extract mock interests from the conversation
    if (lowerMessage.includes('math')) interests.push({ interest: 'Mathematics', category: 'career', strength: 0.9 });
    if (lowerMessage.includes('science')) interests.push({ interest: 'Science', category: 'career', strength: 0.8 });
    if (lowerMessage.includes('programming') || lowerMessage.includes('coding')) {
      interests.push({ interest: 'Programming', category: 'career', strength: 0.95 });
    }
    if (lowerMessage.includes('art') || lowerMessage.includes('music')) {
      interests.push({ interest: 'Creative Arts', category: 'personal', strength: 0.85 });
    }
    
    console.log(`Creating thread: ${threadId} for session: ${sessionId}`);
  }
  
  // Simulate completion for interests mode after 3-4 messages
  if (session.mode === 'interests' && session.messageCount >= 3) {
    isComplete = true;
    
    // Generate mock interests
    interests = [
      { interest: 'Technology', category: 'career', strength: 0.9 },
      { interest: 'Mathematics', category: 'career', strength: 0.85 },
      { interest: 'Reading', category: 'personal', strength: 0.8 },
      { interest: 'Community Service', category: 'philanthropic', strength: 0.75 },
      { interest: 'Team Sports', category: 'social', strength: 0.7 }
    ];
  }
  
  const response = {
    reply: aiResponse.content,
    sessionId,
    messageCount: session.messages.length,
    isComplete,
    ...(threadId && { threadId }),
    ...(threadCreated && { threadCreated }),
    ...(interests.length > 0 && { interests })
  };
  
  res.json(response);
});

app.get('/api/interview/:sessionId/status', (req, res) => {
  const { sessionId } = req.params;
  
  console.log(`GET /api/interview/${sessionId}/status - Checking session status`);
  
  const session = interviewSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    sessionId,
    status: session.status,
    startTime: session.startTime,
    messageCount: session.messages.length,
    topic: session.topic,
    duration: Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000)
  });
});

app.get('/api/interview/:sessionId/ice-servers', (req, res) => {
  const { sessionId } = req.params;
  
  console.log(`GET /api/interview/${sessionId}/ice-servers - Returning ICE servers`);
  
  const session = interviewSessions.get(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json({
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302'
      },
      {
        urls: 'stun:stun1.l.google.com:19302'
      }
    ]
  });
});

// Thread endpoints
const threads = new Map();

app.get('/api/thread/:threadId', (req, res) => {
  const { threadId } = req.params;
  console.log(`GET /api/thread/${threadId} - Getting thread details`);
  
  // Create a mock thread if it doesn't exist
  if (!threads.has(threadId)) {
    threads.set(threadId, {
      threadId,
      userId: 'mock-user-id',
      userInput: 'How does calculus relate to physics?',
      analysis: {
        subjects: ['Mathematics', 'Physics'],
        topics: ['Calculus', 'Mechanics', 'Kinematics'],
        concepts: ['Derivatives', 'Integrals', 'Motion', 'Forces'],
        summary: 'Exploring the mathematical foundations of physics through calculus'
      },
      sections: [
        {
          id: 'section-1',
          title: 'Introduction to Calculus in Physics',
          text: 'Calculus provides the mathematical framework for understanding continuous change in physics...',
          relevanceScore: 0.95,
          difficulty: 'intermediate',
          estimatedMinutes: 15
        },
        {
          id: 'section-2',
          title: 'Derivatives and Velocity',
          text: 'The derivative represents the rate of change, which in physics translates to velocity...',
          relevanceScore: 0.92,
          difficulty: 'intermediate',
          estimatedMinutes: 20
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    });
  }
  
  const thread = threads.get(threadId);
  res.json(thread);
});

app.get('/api/threads', (req, res) => {
  const { userId } = req.query;
  console.log(`GET /api/threads - Getting threads for user: ${userId}`);
  
  // Return mock threads
  res.json({
    threads: Array.from(threads.values()).filter(t => t.userId === userId || !userId),
    total: threads.size
  });
});

// Auth endpoints
app.post('/auth/login', (req, res) => {
  res.json({
    access_token: 'mock-jwt-token',
    token_type: 'Bearer',
    expires_in: 3600
  });
});

app.get('/auth/profile', (req, res) => {
  res.json({
    user_id: 'mock-user-id',
    email: 'hutchenbach@gmail.com',
    role: 'student'
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET /api/content/books - List all textbooks');
  console.log('  GET /api/content/books/:id - Get textbook by ID');
  console.log('  GET /api/courses - List courses');
  console.log('  GET /api/courses/search - Search courses');
  console.log('  GET /api/learning-paths - List learning paths');
  console.log('  GET /api/analytics/progress - Get student progress stats');
  console.log('  POST /api/interview/start - Start interview session');
  console.log('  POST /api/interview/:sessionId/message - Send interview message');
  console.log('  GET /api/interview/:sessionId/status - Get interview status');
  console.log('  GET /api/interview/:sessionId/ice-servers - Get ICE servers');
  console.log('  GET /api/thread/:threadId - Get thread details');
  console.log('  GET /api/threads - List user threads');
  console.log('  POST /auth/login - Mock login');
  console.log('  GET /auth/profile - Get user profile');
});
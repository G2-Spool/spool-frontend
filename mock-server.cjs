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
  console.log('  POST /auth/login - Mock login');
});
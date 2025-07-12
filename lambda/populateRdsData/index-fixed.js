const { Client } = require('pg');
const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ region: 'us-east-1' });

// SQL queries for creating tables
const CREATE_TABLES_SQL = `
-- Create threads table if not exists
CREATE TABLE IF NOT EXISTS threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(255) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    interests TEXT[] DEFAULT '{}',
    concepts TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) DEFAULT 'system'
);

-- Create thread_analysis table if not exists
CREATE TABLE IF NOT EXISTS thread_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    subjects TEXT[] NOT NULL,
    topics TEXT[] NOT NULL,
    concepts TEXT[] NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create thread_sections table if not exists
CREATE TABLE IF NOT EXISTS thread_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    section_number INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    text TEXT NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 0.85 CHECK (relevance_score >= 0.75 AND relevance_score <= 1.0),
    course_id VARCHAR(255),
    concept_ids TEXT[] DEFAULT '{}',
    difficulty VARCHAR(50) DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_minutes INTEGER DEFAULT 5 CHECK (estimated_minutes > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, section_number)
);

-- Create indexes if not exists
CREATE INDEX IF NOT EXISTS idx_threads_student ON threads(student_id);
CREATE INDEX IF NOT EXISTS idx_threads_status ON threads(status);
CREATE INDEX IF NOT EXISTS idx_thread_sections_thread ON thread_sections(thread_id);
CREATE INDEX IF NOT EXISTS idx_thread_analysis_thread ON thread_analysis(thread_id);
`;

// Thread questions for data generation
const THREAD_QUESTIONS = [
    "How can I build a video game that teaches climate science?",
    "What math do I need to understand machine learning?",
    "How does the human brain process music and emotions?",
    "Can you explain quantum computing using everyday examples?",
    "How do I create a mobile app for environmental monitoring?",
    "What's the connection between art history and modern UI design?",
    "How can I use data science to analyze sports performance?",
    "What physics concepts are used in special effects?",
    "How do I build a robot that can navigate autonomously?",
    "What's the relationship between nutrition and cognitive performance?"
];

// Users from Cognito
const USERS = [
    { id: "1418b4b8-d041-702f-7cc6-e37de4f3e9a4", email: "2spool4school@gmail.com" },
    { id: "14e80418-8021-705a-8e29-070904948c95", email: "shpoolbot@spool.com" },
    { id: "4478c408-f0c1-70a2-f256-6aa0916d9192", email: "dslunde@gmail.com" },
    { id: "54782488-80d1-700e-a811-61db1c08da10", email: "ahmadirad174@gmail.com" },
    { id: "6438d4b8-9021-70c9-0a2c-89e7ff07cd7b", email: "test@spool.com" },
    { id: "84088498-f081-7017-3133-740110ae1175", email: "getthatthread@gmail.com" },
    { id: "a4a85458-d091-709b-1b18-f63e982049a4", email: "yarnoflife@gmail.com" },
    { id: "c4482458-5001-70ec-64fa-45e6286a058e", email: "sean@gmail.com" },
    { id: "c4d814e8-5021-705c-dbb8-c1241f9e43c3", email: "hutchenbach@gmail.com" },
    { id: "d4b8c448-c0e1-70d4-3bb2-bf711cd5cddb", email: "dummy@gmail.com" }
];

async function getDbConfig() {
    // Use hardcoded values for now since SSM is timing out
    return {
        host: 'database-1.cmtqo5bo1y3x.us-east-1.rds.amazonaws.com',
        port: '5432',
        database: 'postgres', // Connect to postgres first to create spool
        username: 'postgres',
        password: 'spoolrds'
    };
}

function getThreadMetadata(question) {
    const defaultMeta = {
        subjects: ['Science', 'Technology', 'Engineering', 'Mathematics'],
        topics: ['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning'],
        concepts: ['Analysis', 'Design Thinking', 'Implementation', 'Evaluation'],
        summary: 'Develop interdisciplinary skills through hands-on exploration.',
        sections: [
            { title: 'Introduction', text: 'Foundation concepts and terminology.' },
            { title: 'Core Concepts', text: 'Deep dive into principles and theories.' },
            { title: 'Applications', text: 'Real-world examples and exercises.' }
        ]
    };
    
    if (question.includes('game') && question.includes('climate')) {
        return {
            subjects: ['Computer Science', 'Environmental Science', 'Physics', 'Game Design'],
            topics: ['Game Development', 'Climate Modeling', 'Educational Technology', 'Interactive Media'],
            concepts: ['Game Engines', 'Climate Systems', 'Player Engagement', 'Data Visualization'],
            summary: 'Create educational games that teach environmental concepts through interactive gameplay.',
            sections: [
                { title: 'Game Design Fundamentals', text: 'Learn the basics of game design and player engagement.' },
                { title: 'Climate Science Basics', text: 'Understand key climate concepts and data.' },
                { title: 'Educational Mechanics', text: 'Design gameplay that teaches effectively.' },
                { title: 'Implementation', text: 'Build your climate education game.' }
            ]
        };
    } else if (question.includes('machine learning')) {
        return {
            subjects: ['Mathematics', 'Computer Science', 'Statistics', 'Data Science'],
            topics: ['Linear Algebra', 'Calculus', 'Probability Theory', 'Algorithms'],
            concepts: ['Matrices', 'Derivatives', 'Gradient Descent', 'Neural Networks'],
            summary: 'Master the mathematical foundations essential for understanding machine learning.',
            sections: [
                { title: 'Mathematical Prerequisites', text: 'Essential math concepts for ML.' },
                { title: 'Linear Algebra for ML', text: 'Vectors, matrices, and transformations.' },
                { title: 'Calculus in ML', text: 'Derivatives and optimization.' },
                { title: 'Statistical Foundations', text: 'Probability and distributions.' }
            ]
        };
    }
    
    return defaultMeta;
}

async function createDatabase(client) {
    try {
        // Check if database exists
        const checkDb = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'spool'"
        );
        
        if (checkDb.rows.length === 0) {
            console.log('Creating spool database...');
            await client.query('CREATE DATABASE spool');
            console.log('Database created successfully');
        } else {
            console.log('Database spool already exists');
        }
    } catch (error) {
        console.error('Error creating database:', error);
        throw error;
    }
}

async function generateThreadData(client, userId, email) {
    const numThreads = Math.floor(Math.random() * 3) + 2; // 2-4 threads per user
    const threadsCreated = [];
    
    for (let i = 0; i < numThreads; i++) {
        const question = THREAD_QUESTIONS[Math.floor(Math.random() * THREAD_QUESTIONS.length)];
        const metadata = getThreadMetadata(question);
        const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // Random date in last 30 days
        
        try {
            // Insert thread
            const threadResult = await client.query(
                `INSERT INTO threads (student_id, title, description, interests, concepts, status, created_at, updated_at)
                 VALUES ($1, $2, $3, $4, $5, 'active', $6, $6)
                 RETURNING id`,
                [
                    userId,
                    question,
                    `AI-generated learning thread for ${email}`,
                    ['learning', 'technology', 'science'],
                    ['critical-thinking', 'problem-solving', 'creativity'],
                    createdAt
                ]
            );
            
            const threadId = threadResult.rows[0].id;
            
            // Insert thread analysis
            await client.query(
                `INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
                 VALUES ($1, $2, $3, $4, $5)`,
                [threadId, metadata.subjects, metadata.topics, metadata.concepts, metadata.summary]
            );
            
            // Insert sections
            for (let j = 0; j < metadata.sections.length; j++) {
                const section = metadata.sections[j];
                const relevanceScore = 0.80 + Math.random() * 0.15; // 0.80-0.95
                const difficulty = j === 0 ? 'beginner' : j < 3 ? 'intermediate' : 'advanced';
                const estimatedMinutes = Math.floor(Math.random() * 7) + 5; // 5-11 minutes
                
                await client.query(
                    `INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [threadId, j + 1, section.title, section.text, relevanceScore, difficulty, estimatedMinutes]
                );
            }
            
            threadsCreated.push({ threadId, question });
        } catch (error) {
            console.error(`Error creating thread for user ${email}:`, error);
        }
    }
    
    return threadsCreated;
}

exports.handler = async (event) => {
    let client;
    let spoolClient;
    
    try {
        console.log('Getting database configuration...');
        const dbConfig = await getDbConfig();
        
        // First connect to postgres database to create spool
        client = new Client({
            host: dbConfig.host,
            port: parseInt(dbConfig.port),
            database: 'postgres',
            user: dbConfig.username,
            password: dbConfig.password,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        console.log('Connecting to postgres database...');
        await client.connect();
        
        // Create spool database if it doesn't exist
        await createDatabase(client);
        
        // Close connection to postgres
        await client.end();
        
        // Now connect to spool database
        spoolClient = new Client({
            host: dbConfig.host,
            port: parseInt(dbConfig.port),
            database: 'spool',
            user: dbConfig.username,
            password: dbConfig.password,
            ssl: {
                rejectUnauthorized: false
            }
        });
        
        console.log('Connecting to spool database...');
        await spoolClient.connect();
        
        // Create tables
        console.log('Creating tables...');
        await spoolClient.query(CREATE_TABLES_SQL);
        
        // Generate data for each user
        console.log('Generating thread data for users...');
        const results = [];
        
        for (const user of USERS) {
            console.log(`Creating threads for ${user.email}...`);
            const userThreads = await generateThreadData(spoolClient, user.id, user.email);
            results.push({
                user: user.email,
                threadsCreated: userThreads.length,
                threads: userThreads
            });
        }
        
        // Get summary statistics
        const stats = await spoolClient.query(`
            SELECT 
                COUNT(DISTINCT t.id) as total_threads,
                COUNT(DISTINCT t.student_id) as unique_users,
                COUNT(DISTINCT ts.id) as total_sections
            FROM threads t
            LEFT JOIN thread_sections ts ON t.id = ts.thread_id
        `);
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Thread data population completed successfully',
                summary: stats.rows[0],
                userResults: results
            })
        };
        
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to populate thread data',
                details: error.message
            })
        };
    } finally {
        if (client && client._connected) {
            await client.end();
        }
        if (spoolClient && spoolClient._connected) {
            await spoolClient.end();
        }
    }
};
-- Spool Thread-Based Learning Database Schema
-- This creates the tables needed for the /threads page functionality

-- Create threads table (simplified version matching threadService.js)
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

-- Create thread_analysis table
CREATE TABLE IF NOT EXISTS thread_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    subjects TEXT[] NOT NULL,
    topics TEXT[] NOT NULL,
    concepts TEXT[] NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create thread_sections table
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

-- Create indexes for performance
CREATE INDEX idx_threads_student ON threads(student_id);
CREATE INDEX idx_threads_status ON threads(status);
CREATE INDEX idx_threads_created ON threads(created_at DESC);
CREATE INDEX idx_thread_sections_thread ON thread_sections(thread_id);
CREATE INDEX idx_thread_analysis_thread ON thread_analysis(thread_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for threads table
CREATE TRIGGER update_threads_updated_at 
    BEFORE UPDATE ON threads 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create view for easy thread data retrieval
CREATE OR REPLACE VIEW thread_details AS
SELECT 
    t.id,
    t.student_id,
    t.title,
    t.description,
    t.interests,
    t.concepts,
    t.status,
    t.created_at,
    t.updated_at,
    ta.subjects,
    ta.topics,
    ta.concepts as analysis_concepts,
    ta.summary,
    COUNT(ts.id) as section_count,
    SUM(ts.estimated_minutes) as total_minutes
FROM threads t
LEFT JOIN thread_analysis ta ON t.id = ta.thread_id
LEFT JOIN thread_sections ts ON t.id = ts.thread_id
GROUP BY t.id, t.student_id, t.title, t.description, t.interests, 
         t.concepts, t.status, t.created_at, t.updated_at,
         ta.subjects, ta.topics, ta.concepts, ta.summary;
-- Verification queries to check thread data integrity

-- 1. Check thread distribution by user
SELECT 
    t.student_id,
    COUNT(*) as thread_count,
    MAX(t.created_at) as latest_thread,
    MIN(t.created_at) as oldest_thread
FROM threads t
GROUP BY t.student_id
ORDER BY thread_count DESC;

-- 2. Check thread sections and analysis completeness
SELECT 
    t.id,
    t.title,
    t.status,
    CASE WHEN ta.id IS NOT NULL THEN 'Yes' ELSE 'No' END as has_analysis,
    COUNT(ts.id) as section_count,
    SUM(ts.estimated_minutes) as total_minutes
FROM threads t
LEFT JOIN thread_analysis ta ON t.id = ta.thread_id
LEFT JOIN thread_sections ts ON t.id = ts.thread_id
GROUP BY t.id, t.title, t.status, ta.id
ORDER BY t.created_at DESC;

-- 3. Check relevance scores distribution
SELECT 
    ROUND(relevance_score, 1) as score_range,
    COUNT(*) as section_count
FROM thread_sections
GROUP BY ROUND(relevance_score, 1)
ORDER BY score_range DESC;

-- 4. Check difficulty distribution
SELECT 
    difficulty,
    COUNT(*) as section_count,
    AVG(estimated_minutes) as avg_minutes
FROM thread_sections
GROUP BY difficulty
ORDER BY 
    CASE difficulty 
        WHEN 'beginner' THEN 1
        WHEN 'intermediate' THEN 2
        WHEN 'advanced' THEN 3
    END;

-- 5. Sample complete thread data (as JSON)
SELECT 
    json_build_object(
        'threadId', t.id,
        'userId', t.student_id,
        'userInput', t.title,
        'analysis', json_build_object(
            'subjects', ta.subjects,
            'topics', ta.topics,
            'concepts', ta.concepts,
            'summary', ta.summary
        ),
        'sections', json_agg(
            json_build_object(
                'id', ts.id,
                'title', ts.title,
                'text', ts.text,
                'relevanceScore', ts.relevance_score,
                'difficulty', ts.difficulty,
                'estimatedMinutes', ts.estimated_minutes
            ) ORDER BY ts.section_number
        ),
        'createdAt', t.created_at,
        'updatedAt', t.updated_at,
        'status', t.status
    ) as thread_data
FROM threads t
JOIN thread_analysis ta ON t.id = ta.thread_id
JOIN thread_sections ts ON t.id = ts.thread_id
WHERE t.student_id = '4478c408-f0c1-70a2-f256-6aa0916d9192' -- dslunde@gmail.com
GROUP BY t.id, t.student_id, t.title, t.created_at, t.updated_at, t.status,
         ta.subjects, ta.topics, ta.concepts, ta.summary
LIMIT 1;
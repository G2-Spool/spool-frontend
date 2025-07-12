-- Spool Thread Data Generation Script
-- This script generates realistic thread data for existing Cognito users

-- Function to generate random thread data for a user
CREATE OR REPLACE FUNCTION generate_thread_data(
    p_user_id VARCHAR(255),
    p_user_email VARCHAR(255)
) RETURNS UUID AS $$
DECLARE
    v_thread_id UUID;
    v_questions TEXT[] := ARRAY[
        'How can I build a video game that teaches climate science?',
        'What math do I need to understand machine learning?',
        'How does the human brain process music and emotions?',
        'Can you explain quantum computing using everyday examples?',
        'How do I create a mobile app for environmental monitoring?',
        'What''s the connection between art history and modern UI design?',
        'How can I use data science to analyze sports performance?',
        'What physics concepts are used in special effects?',
        'How do I build a robot that can navigate autonomously?',
        'What''s the relationship between nutrition and cognitive performance?',
        'How can blockchain be used for social good?',
        'What chemistry is involved in cooking and baking?',
        'How do ecosystems maintain balance naturally?',
        'Can I use AI to compose original music?',
        'What''s the science behind renewable energy sources?',
        'How do vaccines work at the molecular level?',
        'What programming languages should I learn for game development?',
        'How does GPS technology actually work?',
        'What''s the psychology behind effective learning?',
        'How can I build a weather prediction system?'
    ];
    v_question TEXT;
    v_subjects TEXT[];
    v_topics TEXT[];
    v_concepts TEXT[];
    v_summary TEXT;
    v_num_sections INTEGER;
    v_section_titles TEXT[];
    v_section_texts TEXT[];
    i INTEGER;
BEGIN
    -- Select a random question
    v_question := v_questions[floor(random() * array_length(v_questions, 1) + 1)];
    
    -- Create the thread with a timestamp from the last 30 days
    INSERT INTO threads (student_id, title, description, interests, concepts, status, created_at, updated_at)
    VALUES (
        p_user_id,
        v_question,
        'AI-generated learning thread exploring cross-curricular connections',
        CASE 
            WHEN v_question LIKE '%game%' THEN ARRAY['gaming', 'technology', 'creativity']
            WHEN v_question LIKE '%climate%' OR v_question LIKE '%environment%' THEN ARRAY['environment', 'science', 'sustainability']
            WHEN v_question LIKE '%music%' OR v_question LIKE '%art%' THEN ARRAY['arts', 'creativity', 'culture']
            WHEN v_question LIKE '%robot%' OR v_question LIKE '%AI%' THEN ARRAY['robotics', 'AI', 'engineering']
            WHEN v_question LIKE '%math%' OR v_question LIKE '%data%' THEN ARRAY['mathematics', 'analytics', 'problem-solving']
            ELSE ARRAY['learning', 'science', 'technology']
        END,
        ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis'],
        'active',
        NOW() - (random() * INTERVAL '30 days'),
        NOW() - (random() * INTERVAL '30 days')
    ) RETURNING id INTO v_thread_id;
    
    -- Generate appropriate subjects, topics, and concepts based on the question
    IF v_question LIKE '%video game%' AND v_question LIKE '%climate%' THEN
        v_subjects := ARRAY['Computer Science', 'Environmental Science', 'Physics', 'Game Design'];
        v_topics := ARRAY['Game Development', 'Climate Modeling', 'Educational Technology', 'Interactive Media'];
        v_concepts := ARRAY['Game Engines', 'Climate Systems', 'Player Engagement', 'Environmental Data Visualization'];
        v_summary := 'Explore the intersection of game development and climate science to create engaging educational experiences that teach environmental concepts through interactive gameplay.';
        v_section_titles := ARRAY['Game Design Fundamentals', 'Climate Science Basics', 'Educational Game Mechanics', 'Implementation Strategies', 'Testing and Iteration'];
    ELSIF v_question LIKE '%machine learning%' THEN
        v_subjects := ARRAY['Mathematics', 'Computer Science', 'Statistics', 'Data Science'];
        v_topics := ARRAY['Linear Algebra', 'Calculus', 'Probability Theory', 'Algorithm Design'];
        v_concepts := ARRAY['Matrices', 'Derivatives', 'Gradient Descent', 'Neural Networks', 'Optimization'];
        v_summary := 'Master the mathematical foundations essential for understanding machine learning, from linear algebra to calculus and probability theory.';
        v_section_titles := ARRAY['Mathematical Prerequisites', 'Linear Algebra for ML', 'Calculus in Optimization', 'Statistical Foundations', 'Practical Applications'];
    ELSIF v_question LIKE '%brain%' AND v_question LIKE '%music%' THEN
        v_subjects := ARRAY['Neuroscience', 'Psychology', 'Music Theory', 'Biology'];
        v_topics := ARRAY['Auditory Processing', 'Emotion and Cognition', 'Neural Networks', 'Music Perception'];
        v_concepts := ARRAY['Auditory Cortex', 'Dopamine Pathways', 'Pattern Recognition', 'Emotional Memory'];
        v_summary := 'Discover how the human brain processes music and generates emotional responses through complex neural mechanisms and psychological principles.';
        v_section_titles := ARRAY['The Auditory System', 'Neural Processing of Music', 'Emotion and Music', 'Cultural and Individual Differences'];
    ELSIF v_question LIKE '%quantum computing%' THEN
        v_subjects := ARRAY['Physics', 'Computer Science', 'Mathematics', 'Engineering'];
        v_topics := ARRAY['Quantum Mechanics', 'Quantum Gates', 'Algorithms', 'Applications'];
        v_concepts := ARRAY['Superposition', 'Entanglement', 'Qubits', 'Quantum Algorithms'];
        v_summary := 'Demystify quantum computing through everyday analogies and practical examples, making complex quantum concepts accessible.';
        v_section_titles := ARRAY['Classical vs Quantum', 'Quantum Basics Explained', 'How Quantum Computers Work', 'Real-World Applications'];
    ELSIF v_question LIKE '%mobile app%' AND v_question LIKE '%environment%' THEN
        v_subjects := ARRAY['Computer Science', 'Environmental Science', 'Design', 'Data Science'];
        v_topics := ARRAY['Mobile Development', 'Environmental Monitoring', 'User Experience', 'Data Collection'];
        v_concepts := ARRAY['App Architecture', 'Sensor Integration', 'Data Visualization', 'User Engagement'];
        v_summary := 'Learn to build mobile applications that help monitor and protect the environment through citizen science and data collection.';
        v_section_titles := ARRAY['App Development Basics', 'Environmental Data Types', 'Sensor Integration', 'User Interface Design', 'Data Analysis and Reporting'];
    ELSE
        -- Generic interdisciplinary content
        v_subjects := ARRAY['Science', 'Technology', 'Engineering', 'Mathematics'];
        v_topics := ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning'];
        v_concepts := ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration'];
        v_summary := 'Develop interdisciplinary skills through hands-on exploration and practical application of STEM concepts.';
        v_section_titles := ARRAY['Introduction to the Topic', 'Core Concepts', 'Practical Applications', 'Advanced Techniques', 'Project-Based Learning'];
    END IF;
    
    -- Insert thread analysis
    INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
    VALUES (v_thread_id, v_subjects, v_topics, v_concepts, v_summary);
    
    -- Generate 3-5 sections per thread
    v_num_sections := floor(random() * 3 + 3)::INTEGER;
    
    -- Ensure we don't exceed available section titles
    v_num_sections := LEAST(v_num_sections, array_length(v_section_titles, 1));
    
    FOR i IN 1..v_num_sections LOOP
        -- Generate section content based on the title
        v_section_texts := ARRAY[
            'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning.',
            'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together.',
            'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning.',
            'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities.',
            'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful.'
        ];
        
        INSERT INTO thread_sections (
            thread_id,
            section_number,
            title,
            text,
            relevance_score,
            difficulty,
            estimated_minutes
        ) VALUES (
            v_thread_id,
            i,
            v_section_titles[i],
            v_section_texts[i],
            0.75 + random() * 0.20, -- Relevance score between 0.75 and 0.95
            CASE 
                WHEN i <= 2 THEN 'beginner'
                WHEN i <= 4 THEN 'intermediate'
                ELSE 'advanced'
            END,
            floor(random() * 7 + 4)::INTEGER -- 4-10 minutes per section
        );
    END LOOP;
    
    RETURN v_thread_id;
END;
$$ LANGUAGE plpgsql;

-- Generate threads for actual Cognito users
DO $$
DECLARE
    v_thread_id UUID;
    v_thread_count INTEGER;
BEGIN
    -- User: 2spool4school@gmail.com
    FOR i IN 1..3 LOOP
        v_thread_id := generate_thread_data('1418b4b8-d041-702f-7cc6-e37de4f3e9a4', '2spool4school@gmail.com');
        RAISE NOTICE 'Created thread % for user 2spool4school@gmail.com', v_thread_id;
    END LOOP;
    
    -- User: shpoolbot@spool.com
    FOR i IN 1..2 LOOP
        v_thread_id := generate_thread_data('14e80418-8021-705a-8e29-070904948c95', 'shpoolbot@spool.com');
        RAISE NOTICE 'Created thread % for user shpoolbot@spool.com', v_thread_id;
    END LOOP;
    
    -- User: dslunde@gmail.com
    FOR i IN 1..4 LOOP
        v_thread_id := generate_thread_data('4478c408-f0c1-70a2-f256-6aa0916d9192', 'dslunde@gmail.com');
        RAISE NOTICE 'Created thread % for user dslunde@gmail.com', v_thread_id;
    END LOOP;
    
    -- User: ahmadirad174@gmail.com
    FOR i IN 1..3 LOOP
        v_thread_id := generate_thread_data('54782488-80d1-700e-a811-61db1c08da10', 'ahmadirad174@gmail.com');
        RAISE NOTICE 'Created thread % for user ahmadirad174@gmail.com', v_thread_id;
    END LOOP;
    
    -- User: test@spool.com
    FOR i IN 1..2 LOOP
        v_thread_id := generate_thread_data('6438d4b8-9021-70c9-0a2c-89e7ff07cd7b', 'test@spool.com');
        RAISE NOTICE 'Created thread % for user test@spool.com', v_thread_id;
    END LOOP;
    
    -- Count total threads created
    SELECT COUNT(*) INTO v_thread_count FROM threads;
    RAISE NOTICE 'Total threads created: %', v_thread_count;
END $$;

-- Verify the data was created correctly
SELECT 
    'Thread Summary:' as info,
    COUNT(DISTINCT t.id) as total_threads,
    COUNT(DISTINCT t.student_id) as unique_users,
    COUNT(DISTINCT ts.id) as total_sections,
    AVG(section_counts.sections_per_thread)::NUMERIC(10,2) as avg_sections_per_thread
FROM threads t
LEFT JOIN thread_sections ts ON t.id = ts.thread_id
CROSS JOIN (
    SELECT AVG(section_count)::NUMERIC(10,2) as sections_per_thread
    FROM (
        SELECT thread_id, COUNT(*) as section_count
        FROM thread_sections
        GROUP BY thread_id
    ) sc
) section_counts;

-- Show sample thread data
SELECT 
    t.title as "Question",
    ta.subjects as "Subjects",
    ta.summary as "Summary",
    COUNT(ts.id) as "Sections",
    SUM(ts.estimated_minutes) as "Total Minutes"
FROM threads t
JOIN thread_analysis ta ON t.id = ta.thread_id
LEFT JOIN thread_sections ts ON t.id = ts.thread_id
GROUP BY t.id, t.title, ta.subjects, ta.summary
LIMIT 5;
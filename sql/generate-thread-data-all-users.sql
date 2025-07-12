-- Spool Thread Data Generation Script for All 10 Users
-- This script generates realistic thread data for all users in the Cognito user pool

-- Create the spool database if it doesn't exist
-- Note: Run this separately as postgres user if needed
-- CREATE DATABASE spool;

-- Connect to spool database
\c spool;

-- Function to generate random thread data for a user (if not exists)
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
        'How can I build a weather prediction system?',
        'What are the mathematical principles behind cryptography?',
        'How do neural networks mimic the human brain?',
        'What''s the physics of flight and aerodynamics?',
        'How can I create sustainable architecture designs?',
        'What''s the biology behind genetic engineering?',
        'How do search engines rank and organize information?',
        'What chemistry makes batteries work?',
        'How can I analyze literary patterns with data science?',
        'What''s the science of sound engineering and acoustics?',
        'How do financial markets use mathematical models?'
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
        'AI-generated learning thread for ' || p_user_email || ' exploring cross-curricular connections',
        CASE 
            WHEN v_question LIKE '%game%' THEN ARRAY['gaming', 'technology', 'creativity', 'education']
            WHEN v_question LIKE '%climate%' OR v_question LIKE '%environment%' OR v_question LIKE '%sustainable%' THEN ARRAY['environment', 'science', 'sustainability', 'innovation']
            WHEN v_question LIKE '%music%' OR v_question LIKE '%art%' OR v_question LIKE '%literary%' THEN ARRAY['arts', 'creativity', 'culture', 'expression']
            WHEN v_question LIKE '%robot%' OR v_question LIKE '%AI%' OR v_question LIKE '%neural%' THEN ARRAY['robotics', 'AI', 'engineering', 'future-tech']
            WHEN v_question LIKE '%math%' OR v_question LIKE '%data%' OR v_question LIKE '%financial%' THEN ARRAY['mathematics', 'analytics', 'problem-solving', 'logic']
            WHEN v_question LIKE '%biology%' OR v_question LIKE '%genetic%' OR v_question LIKE '%vaccine%' THEN ARRAY['biology', 'health', 'research', 'life-sciences']
            WHEN v_question LIKE '%physics%' OR v_question LIKE '%quantum%' OR v_question LIKE '%flight%' THEN ARRAY['physics', 'engineering', 'innovation', 'theory']
            WHEN v_question LIKE '%chemistry%' OR v_question LIKE '%battery%' OR v_question LIKE '%cooking%' THEN ARRAY['chemistry', 'experimentation', 'materials', 'reactions']
            ELSE ARRAY['learning', 'science', 'technology', 'discovery']
        END,
        ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis'],
        'active',
        NOW() - (random() * INTERVAL '30 days'),
        NOW() - (random() * INTERVAL '30 days')
    ) RETURNING id INTO v_thread_id;
    
    -- Generate appropriate subjects, topics, and concepts based on the question
    IF v_question LIKE '%video game%' AND v_question LIKE '%climate%' THEN
        v_subjects := ARRAY['Computer Science', 'Environmental Science', 'Physics', 'Game Design', 'Psychology'];
        v_topics := ARRAY['Game Development', 'Climate Modeling', 'Educational Technology', 'Interactive Media', 'Behavioral Change'];
        v_concepts := ARRAY['Game Engines', 'Climate Systems', 'Player Engagement', 'Environmental Data Visualization', 'Gamification'];
        v_summary := 'Explore the intersection of game development and climate science to create engaging educational experiences that teach environmental concepts through interactive gameplay and behavioral psychology.';
        v_section_titles := ARRAY['Game Design Fundamentals', 'Climate Science Basics', 'Educational Game Mechanics', 'Implementation Strategies', 'Testing and Player Impact'];
    ELSIF v_question LIKE '%machine learning%' THEN
        v_subjects := ARRAY['Mathematics', 'Computer Science', 'Statistics', 'Data Science', 'Linear Algebra'];
        v_topics := ARRAY['Linear Algebra', 'Calculus', 'Probability Theory', 'Algorithm Design', 'Optimization'];
        v_concepts := ARRAY['Matrices', 'Derivatives', 'Gradient Descent', 'Neural Networks', 'Backpropagation', 'Loss Functions'];
        v_summary := 'Master the mathematical foundations essential for understanding machine learning, from linear algebra to calculus and probability theory, with practical coding applications.';
        v_section_titles := ARRAY['Mathematical Prerequisites', 'Linear Algebra for ML', 'Calculus in Optimization', 'Statistical Foundations', 'Practical ML Implementation'];
    ELSIF v_question LIKE '%brain%' AND v_question LIKE '%music%' THEN
        v_subjects := ARRAY['Neuroscience', 'Psychology', 'Music Theory', 'Biology', 'Cognitive Science'];
        v_topics := ARRAY['Auditory Processing', 'Emotion and Cognition', 'Neural Networks', 'Music Perception', 'Memory Formation'];
        v_concepts := ARRAY['Auditory Cortex', 'Dopamine Pathways', 'Pattern Recognition', 'Emotional Memory', 'Neuroplasticity'];
        v_summary := 'Discover how the human brain processes music and generates emotional responses through complex neural mechanisms, psychological principles, and evolutionary adaptations.';
        v_section_titles := ARRAY['The Auditory System', 'Neural Processing of Music', 'Emotion and Music', 'Cultural and Individual Differences', 'Music Therapy Applications'];
    ELSIF v_question LIKE '%quantum computing%' THEN
        v_subjects := ARRAY['Physics', 'Computer Science', 'Mathematics', 'Engineering', 'Philosophy'];
        v_topics := ARRAY['Quantum Mechanics', 'Quantum Gates', 'Algorithms', 'Applications', 'Quantum Information'];
        v_concepts := ARRAY['Superposition', 'Entanglement', 'Qubits', 'Quantum Algorithms', 'Decoherence', 'Quantum Supremacy'];
        v_summary := 'Demystify quantum computing through everyday analogies and practical examples, making complex quantum concepts accessible while exploring future applications.';
        v_section_titles := ARRAY['Classical vs Quantum', 'Quantum Basics Explained', 'How Quantum Computers Work', 'Real-World Applications', 'The Quantum Future'];
    ELSIF v_question LIKE '%blockchain%' AND v_question LIKE '%social good%' THEN
        v_subjects := ARRAY['Computer Science', 'Economics', 'Social Sciences', 'Ethics', 'Cryptography'];
        v_topics := ARRAY['Distributed Systems', 'Cryptocurrency', 'Social Impact', 'Transparency', 'Decentralization'];
        v_concepts := ARRAY['Consensus Mechanisms', 'Smart Contracts', 'Digital Identity', 'Supply Chain', 'Financial Inclusion'];
        v_summary := 'Explore how blockchain technology can address social challenges through transparency, decentralization, and innovative applications in healthcare, voting, and humanitarian aid.';
        v_section_titles := ARRAY['Blockchain Fundamentals', 'Social Impact Applications', 'Case Studies', 'Implementation Challenges', 'Future Possibilities'];
    ELSIF v_question LIKE '%neural networks%' AND v_question LIKE '%brain%' THEN
        v_subjects := ARRAY['Neuroscience', 'Computer Science', 'Mathematics', 'Cognitive Science', 'Biology'];
        v_topics := ARRAY['Brain Structure', 'Artificial Neurons', 'Learning Mechanisms', 'Parallel Processing', 'Consciousness'];
        v_concepts := ARRAY['Neurons', 'Synapses', 'Perceptrons', 'Deep Learning', 'Neuromorphic Computing'];
        v_summary := 'Compare biological neural networks with artificial ones, understanding how computer scientists draw inspiration from neuroscience to create intelligent systems.';
        v_section_titles := ARRAY['Biological Neural Networks', 'Artificial Neural Networks', 'Learning in Both Systems', 'Current Limitations', 'Future Convergence'];
    ELSE
        -- Generic interdisciplinary content
        v_subjects := ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts'];
        v_topics := ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking'];
        v_concepts := ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking'];
        v_summary := 'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.';
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
        -- Generate varied section content
        v_section_texts := ARRAY[
            'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
            'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
            'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
            'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
            'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.'
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
            v_section_texts[LEAST(i, array_length(v_section_texts, 1))],
            0.80 + random() * 0.15, -- Relevance score between 0.80 and 0.95
            CASE 
                WHEN i <= 2 THEN 'beginner'
                WHEN i <= 4 THEN 'intermediate'
                ELSE 'advanced'
            END,
            floor(random() * 8 + 5)::INTEGER -- 5-12 minutes per section
        );
    END LOOP;
    
    RAISE NOTICE 'Created thread % for user %', v_thread_id, p_user_email;
    RETURN v_thread_id;
END;
$$ LANGUAGE plpgsql;

-- Generate threads for all 10 Cognito users
DO $$
DECLARE
    v_thread_id UUID;
    v_thread_count INTEGER;
    v_user_threads INTEGER;
BEGIN
    RAISE NOTICE 'Starting thread generation for all users...';
    
    -- User 1: 2spool4school@gmail.com
    v_user_threads := floor(random() * 3 + 2)::INTEGER; -- 2-4 threads
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('1418b4b8-d041-702f-7cc6-e37de4f3e9a4', '2spool4school@gmail.com');
    END LOOP;
    
    -- User 2: shpoolbot@spool.com
    v_user_threads := floor(random() * 3 + 2)::INTEGER;
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('14e80418-8021-705a-8e29-070904948c95', 'shpoolbot@spool.com');
    END LOOP;
    
    -- User 3: dslunde@gmail.com
    v_user_threads := floor(random() * 3 + 3)::INTEGER; -- 3-5 threads
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('4478c408-f0c1-70a2-f256-6aa0916d9192', 'dslunde@gmail.com');
    END LOOP;
    
    -- User 4: ahmadirad174@gmail.com
    v_user_threads := floor(random() * 3 + 2)::INTEGER;
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('54782488-80d1-700e-a811-61db1c08da10', 'ahmadirad174@gmail.com');
    END LOOP;
    
    -- User 5: test@spool.com
    v_user_threads := floor(random() * 2 + 2)::INTEGER;
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('6438d4b8-9021-70c9-0a2c-89e7ff07cd7b', 'test@spool.com');
    END LOOP;
    
    -- User 6: getthatthread@gmail.com
    v_user_threads := floor(random() * 3 + 2)::INTEGER;
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('84088498-f081-7017-3133-740110ae1175', 'getthatthread@gmail.com');
    END LOOP;
    
    -- User 7: yarnoflife@gmail.com
    v_user_threads := floor(random() * 3 + 2)::INTEGER;
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('a4a85458-d091-709b-1b18-f63e982049a4', 'yarnoflife@gmail.com');
    END LOOP;
    
    -- User 8: sean@gmail.com
    v_user_threads := floor(random() * 3 + 3)::INTEGER;
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('c4482458-5001-70ec-64fa-45e6286a058e', 'sean@gmail.com');
    END LOOP;
    
    -- User 9: hutchenbach@gmail.com
    v_user_threads := floor(random() * 3 + 2)::INTEGER;
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('c4d814e8-5021-705c-dbb8-c1241f9e43c3', 'hutchenbach@gmail.com');
    END LOOP;
    
    -- User 10: dummy@gmail.com
    v_user_threads := floor(random() * 2 + 1)::INTEGER; -- 1-2 threads
    FOR i IN 1..v_user_threads LOOP
        v_thread_id := generate_thread_data('d4b8c448-c0e1-70d4-3bb2-bf711cd5cddb', 'dummy@gmail.com');
    END LOOP;
    
    -- Count total threads created
    SELECT COUNT(*) INTO v_thread_count FROM threads;
    RAISE NOTICE 'Total threads created: %', v_thread_count;
END $$;

-- Summary statistics
SELECT 
    'Thread Generation Summary:' as info;

SELECT 
    COUNT(DISTINCT t.id) as total_threads,
    COUNT(DISTINCT t.student_id) as unique_users,
    COUNT(DISTINCT ts.id) as total_sections,
    ROUND(AVG(section_counts.sections_per_thread)::NUMERIC, 2) as avg_sections_per_thread,
    ROUND(AVG(section_counts.total_minutes)::NUMERIC, 2) as avg_minutes_per_thread
FROM threads t
LEFT JOIN thread_sections ts ON t.id = ts.thread_id
CROSS JOIN (
    SELECT 
        thread_id, 
        COUNT(*) as sections_per_thread,
        SUM(estimated_minutes) as total_minutes
    FROM thread_sections
    GROUP BY thread_id
) section_counts;

-- Show thread count by user
SELECT 
    t.student_id,
    COUNT(*) as thread_count,
    STRING_AGG(LEFT(t.title, 50) || '...', '; ') as thread_titles
FROM threads t
GROUP BY t.student_id
ORDER BY thread_count DESC;
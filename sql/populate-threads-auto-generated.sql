-- Auto-generated SQL script to populate thread data
-- Generated at: 2025-07-12T15:41:42.131484
-- This script populates threads for all 10 Cognito users

-- Create database if not exists
SELECT 'CREATE DATABASE spool' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'spool')\gexec;

\c spool;

BEGIN;

-- Threads for 2spool4school@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '1418b4b8-d041-702f-7cc6-e37de4f3e9a4',
    'How do vaccines work at the molecular level?',
    'AI-generated learning thread for 2spool4school@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-12T15:41:42.131527',
    '2025-06-12T15:41:42.131527'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.95,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.81,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.93,
    'intermediate',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.95,
    'intermediate',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Project-Based Learning',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.87,
    'advanced',
    10
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '1418b4b8-d041-702f-7cc6-e37de4f3e9a4',
    'How does the human brain process music and emotions?',
    'AI-generated learning thread for 2spool4school@gmail.com exploring cross-curricular connections',
    ARRAY['arts', 'creativity', 'culture', 'expression']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-10T15:41:42.131644',
    '2025-07-10T15:41:42.131644'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Neuroscience', 'Psychology', 'Music Theory', 'Biology', 'Cognitive Science']::TEXT[],
    ARRAY['Auditory Processing', 'Emotion and Cognition', 'Neural Networks', 'Music Perception', 'Memory Formation']::TEXT[],
    ARRAY['Auditory Cortex', 'Dopamine Pathways', 'Pattern Recognition', 'Emotional Memory', 'Neuroplasticity']::TEXT[],
    'Discover how the human brain processes music and generates emotional responses through complex neural mechanisms, psychological principles, and evolutionary adaptations.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'The Auditory System',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.95,
    'beginner',
    6
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Neural Processing of Music',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.93,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Emotion and Music',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.83,
    'intermediate',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Cultural and Individual Differences',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.89,
    'intermediate',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Music Therapy Applications',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.94,
    'advanced',
    8
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '1418b4b8-d041-702f-7cc6-e37de4f3e9a4',
    'How can I use data science to analyze sports performance?',
    'AI-generated learning thread for 2spool4school@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-20T15:41:42.131712',
    '2025-06-20T15:41:42.131712'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.91,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.91,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.85,
    'intermediate',
    10
);

-- Threads for shpoolbot@spool.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '14e80418-8021-705a-8e29-070904948c95',
    'How can I create sustainable architecture designs?',
    'AI-generated learning thread for shpoolbot@spool.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-25T15:41:42.131761',
    '2025-06-25T15:41:42.131761'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.87,
    'beginner',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.89,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.93,
    'intermediate',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.85,
    'intermediate',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Project-Based Learning',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.88,
    'advanced',
    10
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '14e80418-8021-705a-8e29-070904948c95',
    'What''s the physics of flight and aerodynamics?',
    'AI-generated learning thread for shpoolbot@spool.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-03T15:41:42.131830',
    '2025-07-03T15:41:42.131830'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.85,
    'beginner',
    6
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.84,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.93,
    'intermediate',
    6
);

-- Threads for dslunde@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '4478c408-f0c1-70a2-f256-6aa0916d9192',
    'What chemistry makes batteries work?',
    'AI-generated learning thread for dslunde@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-28T15:41:42.131912',
    '2025-06-28T15:41:42.131912'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.87,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.91,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.86,
    'intermediate',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.89,
    'intermediate',
    6
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Project-Based Learning',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.8,
    'advanced',
    10
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '4478c408-f0c1-70a2-f256-6aa0916d9192',
    'What physics concepts are used in special effects?',
    'AI-generated learning thread for dslunde@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-23T15:41:42.131981',
    '2025-06-23T15:41:42.131981'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.92,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.9,
    'beginner',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.95,
    'intermediate',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.91,
    'intermediate',
    8
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '4478c408-f0c1-70a2-f256-6aa0916d9192',
    'What are the mathematical principles behind cryptography?',
    'AI-generated learning thread for dslunde@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-21T15:41:42.132029',
    '2025-06-21T15:41:42.132029'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.89,
    'beginner',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.94,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.95,
    'intermediate',
    6
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.94,
    'intermediate',
    10
);

-- Threads for ahmadirad174@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '54782488-80d1-700e-a811-61db1c08da10',
    'What''s the science of sound engineering and acoustics?',
    'AI-generated learning thread for ahmadirad174@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-05T15:41:42.132078',
    '2025-07-05T15:41:42.132078'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.94,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.85,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.83,
    'intermediate',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.86,
    'intermediate',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Project-Based Learning',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.93,
    'advanced',
    9
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '54782488-80d1-700e-a811-61db1c08da10',
    'How does GPS technology actually work?',
    'AI-generated learning thread for ahmadirad174@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-14T15:41:42.132133',
    '2025-06-14T15:41:42.132133'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.87,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.9,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.92,
    'intermediate',
    10
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.81,
    'intermediate',
    11
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '54782488-80d1-700e-a811-61db1c08da10',
    'What''s the psychology behind effective learning?',
    'AI-generated learning thread for ahmadirad174@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-25T15:41:42.132179',
    '2025-06-25T15:41:42.132179'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.81,
    'beginner',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.86,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.92,
    'intermediate',
    7
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '54782488-80d1-700e-a811-61db1c08da10',
    'How can blockchain be used for social good?',
    'AI-generated learning thread for ahmadirad174@gmail.com exploring cross-curricular connections',
    ARRAY['technology', 'economics', 'social-impact', 'innovation']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-11T15:41:42.132236',
    '2025-07-11T15:41:42.132236'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Computer Science', 'Economics', 'Social Sciences', 'Ethics', 'Cryptography']::TEXT[],
    ARRAY['Distributed Systems', 'Cryptocurrency', 'Social Impact', 'Transparency', 'Decentralization']::TEXT[],
    ARRAY['Consensus Mechanisms', 'Smart Contracts', 'Digital Identity', 'Supply Chain', 'Financial Inclusion']::TEXT[],
    'Explore how blockchain technology can address social challenges through transparency, decentralization, and innovative applications in healthcare, voting, and humanitarian aid.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Blockchain Fundamentals',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.88,
    'beginner',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Social Impact Applications',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.91,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Case Studies',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.85,
    'intermediate',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Implementation Challenges',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.9,
    'intermediate',
    11
);

-- Threads for test@spool.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '6438d4b8-9021-70c9-0a2c-89e7ff07cd7b',
    'How do I create a mobile app for environmental monitoring?',
    'AI-generated learning thread for test@spool.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-06T15:41:42.132291',
    '2025-07-06T15:41:42.132291'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.85,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.94,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.85,
    'intermediate',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.9,
    'intermediate',
    7
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '6438d4b8-9021-70c9-0a2c-89e7ff07cd7b',
    'What''s the psychology behind effective learning?',
    'AI-generated learning thread for test@spool.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-03T15:41:42.132337',
    '2025-07-03T15:41:42.132337'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.93,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.95,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.85,
    'intermediate',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.84,
    'intermediate',
    8
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '6438d4b8-9021-70c9-0a2c-89e7ff07cd7b',
    'What''s the relationship between nutrition and cognitive performance?',
    'AI-generated learning thread for test@spool.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-07T15:41:42.132383',
    '2025-07-07T15:41:42.132383'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.92,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.83,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.9,
    'intermediate',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.87,
    'intermediate',
    10
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '6438d4b8-9021-70c9-0a2c-89e7ff07cd7b',
    'How do financial markets use mathematical models?',
    'AI-generated learning thread for test@spool.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-28T15:41:42.132437',
    '2025-06-28T15:41:42.132437'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.94,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.84,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.83,
    'intermediate',
    5
);

-- Threads for getthatthread@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '84088498-f081-7017-3133-740110ae1175',
    'What''s the biology behind genetic engineering?',
    'AI-generated learning thread for getthatthread@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-29T15:41:42.132485',
    '2025-06-29T15:41:42.132485'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.9,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.84,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.84,
    'intermediate',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.86,
    'intermediate',
    7
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '84088498-f081-7017-3133-740110ae1175',
    'What''s the science behind renewable energy sources?',
    'AI-generated learning thread for getthatthread@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-06T15:41:42.132531',
    '2025-07-06T15:41:42.132531'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.89,
    'beginner',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.85,
    'beginner',
    10
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.81,
    'intermediate',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.88,
    'intermediate',
    10
);

-- Threads for yarnoflife@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a4a85458-d091-709b-1b18-f63e982049a4',
    'How can I use data science to analyze sports performance?',
    'AI-generated learning thread for yarnoflife@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-28T15:41:42.132585',
    '2025-06-28T15:41:42.132585'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.82,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.85,
    'beginner',
    6
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.82,
    'intermediate',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.88,
    'intermediate',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Project-Based Learning',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.8,
    'advanced',
    10
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a4a85458-d091-709b-1b18-f63e982049a4',
    'What''s the science of sound engineering and acoustics?',
    'AI-generated learning thread for yarnoflife@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-01T15:41:42.132635',
    '2025-07-01T15:41:42.132635'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.84,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.88,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.91,
    'intermediate',
    11
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a4a85458-d091-709b-1b18-f63e982049a4',
    'What''s the science of sound engineering and acoustics?',
    'AI-generated learning thread for yarnoflife@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-20T15:41:42.132674',
    '2025-06-20T15:41:42.132674'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.93,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.85,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.91,
    'intermediate',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.87,
    'intermediate',
    12
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'a4a85458-d091-709b-1b18-f63e982049a4',
    'How can I analyze literary patterns with data science?',
    'AI-generated learning thread for yarnoflife@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-07T15:41:42.132725',
    '2025-07-07T15:41:42.132725'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.82,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.94,
    'beginner',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.88,
    'intermediate',
    10
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.88,
    'intermediate',
    12
);

-- Threads for sean@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4482458-5001-70ec-64fa-45e6286a058e',
    'How can I build a weather prediction system?',
    'AI-generated learning thread for sean@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-10T15:41:42.132785',
    '2025-07-10T15:41:42.132785'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.82,
    'beginner',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.83,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.82,
    'intermediate',
    10
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4482458-5001-70ec-64fa-45e6286a058e',
    'What programming languages should I learn for game development?',
    'AI-generated learning thread for sean@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-03T15:41:42.132829',
    '2025-07-03T15:41:42.132829'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.9,
    'beginner',
    6
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.88,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.82,
    'intermediate',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.95,
    'intermediate',
    6
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Project-Based Learning',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.95,
    'advanced',
    8
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4482458-5001-70ec-64fa-45e6286a058e',
    'How can I build a video game that teaches climate science?',
    'AI-generated learning thread for sean@gmail.com exploring cross-curricular connections',
    ARRAY['gaming', 'technology', 'creativity', 'education']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-30T15:41:42.132911',
    '2025-06-30T15:41:42.132911'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Computer Science', 'Environmental Science', 'Physics', 'Game Design', 'Psychology']::TEXT[],
    ARRAY['Game Development', 'Climate Modeling', 'Educational Technology', 'Interactive Media', 'Behavioral Change']::TEXT[],
    ARRAY['Game Engines', 'Climate Systems', 'Player Engagement', 'Environmental Data Visualization', 'Gamification']::TEXT[],
    'Explore the intersection of game development and climate science to create engaging educational experiences that teach environmental concepts through interactive gameplay and behavioral psychology.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Game Design Fundamentals',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.9,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Climate Science Basics',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.89,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Educational Game Mechanics',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.89,
    'intermediate',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Implementation Strategies',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.86,
    'intermediate',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Testing and Player Impact',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.89,
    'advanced',
    11
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4482458-5001-70ec-64fa-45e6286a058e',
    'How does the human brain process music and emotions?',
    'AI-generated learning thread for sean@gmail.com exploring cross-curricular connections',
    ARRAY['arts', 'creativity', 'culture', 'expression']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-13T15:41:42.132973',
    '2025-06-13T15:41:42.132973'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Neuroscience', 'Psychology', 'Music Theory', 'Biology', 'Cognitive Science']::TEXT[],
    ARRAY['Auditory Processing', 'Emotion and Cognition', 'Neural Networks', 'Music Perception', 'Memory Formation']::TEXT[],
    ARRAY['Auditory Cortex', 'Dopamine Pathways', 'Pattern Recognition', 'Emotional Memory', 'Neuroplasticity']::TEXT[],
    'Discover how the human brain processes music and generates emotional responses through complex neural mechanisms, psychological principles, and evolutionary adaptations.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'The Auditory System',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.86,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Neural Processing of Music',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.9,
    'beginner',
    10
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Emotion and Music',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.83,
    'intermediate',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Cultural and Individual Differences',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.95,
    'intermediate',
    12
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4482458-5001-70ec-64fa-45e6286a058e',
    'What''s the relationship between nutrition and cognitive performance?',
    'AI-generated learning thread for sean@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-30T15:41:42.133025',
    '2025-06-30T15:41:42.133025'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.84,
    'beginner',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.93,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.86,
    'intermediate',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.82,
    'intermediate',
    7
);

-- Threads for hutchenbach@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4d814e8-5021-705c-dbb8-c1241f9e43c3',
    'How can I create sustainable architecture designs?',
    'AI-generated learning thread for hutchenbach@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-27T15:41:42.133077',
    '2025-06-27T15:41:42.133077'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.86,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.86,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.93,
    'intermediate',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.88,
    'intermediate',
    8
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4d814e8-5021-705c-dbb8-c1241f9e43c3',
    'How can I create sustainable architecture designs?',
    'AI-generated learning thread for hutchenbach@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-05T15:41:42.133122',
    '2025-07-05T15:41:42.133122'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.94,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.87,
    'beginner',
    12
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.82,
    'intermediate',
    6
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'c4d814e8-5021-705c-dbb8-c1241f9e43c3',
    'What''s the physics of flight and aerodynamics?',
    'AI-generated learning thread for hutchenbach@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-08T15:41:42.133160',
    '2025-07-08T15:41:42.133160'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.95,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.88,
    'beginner',
    10
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.8,
    'intermediate',
    11
);

-- Threads for dummy@gmail.com
INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'd4b8c448-c0e1-70d4-3bb2-bf711cd5cddb',
    'How can blockchain be used for social good?',
    'AI-generated learning thread for dummy@gmail.com exploring cross-curricular connections',
    ARRAY['technology', 'economics', 'social-impact', 'innovation']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-06-12T15:41:42.133201',
    '2025-06-12T15:41:42.133201'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Computer Science', 'Economics', 'Social Sciences', 'Ethics', 'Cryptography']::TEXT[],
    ARRAY['Distributed Systems', 'Cryptocurrency', 'Social Impact', 'Transparency', 'Decentralization']::TEXT[],
    ARRAY['Consensus Mechanisms', 'Smart Contracts', 'Digital Identity', 'Supply Chain', 'Financial Inclusion']::TEXT[],
    'Explore how blockchain technology can address social challenges through transparency, decentralization, and innovative applications in healthcare, voting, and humanitarian aid.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Blockchain Fundamentals',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.84,
    'beginner',
    8
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Social Impact Applications',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.92,
    'beginner',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Case Studies',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.89,
    'intermediate',
    5
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Implementation Challenges',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.82,
    'intermediate',
    9
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    5,
    'Future Possibilities',
    'Bring everything together with a comprehensive project that demonstrates mastery of the concepts. You''ll apply what you''ve learned to create something meaningful and impactful. This capstone experience solidifies your understanding through practical application.',
    0.9,
    'advanced',
    12
);

INSERT INTO threads (id, student_id, title, description, interests, concepts, status, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'd4b8c448-c0e1-70d4-3bb2-bf711cd5cddb',
    'How can I use data science to analyze sports performance?',
    'AI-generated learning thread for dummy@gmail.com exploring cross-curricular connections',
    ARRAY['learning', 'science', 'technology', 'discovery']::TEXT[],
    ARRAY['critical-thinking', 'problem-solving', 'creativity', 'analysis', 'synthesis']::TEXT[],
    'active',
    '2025-07-04T15:41:42.133259',
    '2025-07-04T15:41:42.133259'
);

INSERT INTO thread_analysis (thread_id, subjects, topics, concepts, summary)
VALUES (
    currval('threads_id_seq'),
    ARRAY['Science', 'Technology', 'Engineering', 'Mathematics', 'Liberal Arts']::TEXT[],
    ARRAY['Problem Solving', 'Critical Thinking', 'Innovation', 'Applied Learning', 'Interdisciplinary Thinking']::TEXT[],
    ARRAY['Analysis', 'Design Thinking', 'Implementation', 'Evaluation', 'Iteration', 'Systems Thinking']::TEXT[],
    'Develop interdisciplinary skills through hands-on exploration and practical application of concepts that bridge multiple fields of study.'
);

INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    1,
    'Introduction to the Topic',
    'This foundational section introduces the key concepts and terminology you''ll need to understand the topic. We''ll explore the historical context and current relevance, setting up a solid base for deeper learning. You''ll discover why this knowledge matters and how it connects to your interests.',
    0.8,
    'beginner',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    2,
    'Core Concepts',
    'Dive into the core principles and theories that underpin this subject area. Through clear explanations and visual examples, you''ll gain a comprehensive understanding of how these concepts work together. We''ll break down complex ideas into manageable pieces.',
    0.83,
    'beginner',
    7
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    3,
    'Practical Applications',
    'See how theoretical knowledge translates into real-world applications. This section includes hands-on examples, case studies, and practical exercises to reinforce your learning. You''ll work through problems that professionals in this field encounter daily.',
    0.95,
    'intermediate',
    11
);
INSERT INTO thread_sections (thread_id, section_number, title, text, relevance_score, difficulty, estimated_minutes)
VALUES (
    currval('threads_id_seq'),
    4,
    'Advanced Techniques',
    'Explore advanced concepts and cutting-edge developments in the field. We''ll examine current research, emerging trends, and future possibilities. This section challenges you to think critically about where the field is heading.',
    0.88,
    'intermediate',
    7
);

COMMIT;

-- Total threads to be created: 32
-- Verify with: SELECT COUNT(*) FROM threads;
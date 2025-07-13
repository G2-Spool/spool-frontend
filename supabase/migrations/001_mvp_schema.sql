-- ================================================
-- DROP ALL EXISTING TABLES (CASCADE)
-- ================================================
-- Drop functions first
DROP FUNCTION IF EXISTS evaluate_exercise_attempt CASCADE;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS remediation_contexts CASCADE;
DROP TABLE IF EXISTS step_evaluations CASCADE;
DROP TABLE IF EXISTS exercise_attempts CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS concept_content CASCADE;
DROP TABLE IF EXISTS threads CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any other tables that might exist
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS challenge_progress CASCADE;
DROP TABLE IF EXISTS concept_examples CASCADE;
DROP TABLE IF EXISTS concept_hooks CASCADE;
DROP TABLE IF EXISTS concept_progress CASCADE;
DROP TABLE IF EXISTS concepts CASCADE;
DROP TABLE IF EXISTS daily_challenges CASCADE;
DROP TABLE IF EXISTS engagement_analytics CASCADE;
DROP TABLE IF EXISTS interview_questions CASCADE;
DROP TABLE IF EXISTS interview_responses CASCADE;
DROP TABLE IF EXISTS interview_sessions CASCADE;
DROP TABLE IF EXISTS learning_paths CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS sections CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS textbooks CASCADE;
DROP TABLE IF EXISTS topics CASCADE;

-- ================================================
-- CREATE NEW MVP TABLES
-- ================================================

-- 1. Users table (Minimal)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    primary_interest VARCHAR(50) DEFAULT 'basketball',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Threads table
CREATE TABLE threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    situation_title VARCHAR(255) NOT NULL,
    situation_description TEXT NOT NULL,
    concepts JSONB NOT NULL, -- Array of {id, name, relevance}
    primary_skill_focus JSONB NOT NULL, -- {skill, description}
    status VARCHAR(50) DEFAULT 'active', -- active, completed, paused
    current_concept_id VARCHAR(100), -- Currently active concept
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_threads_user ON threads(user_id);
CREATE INDEX idx_threads_status ON threads(status);

-- 3. Concept content table (Static for MVP)
CREATE TABLE concept_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id VARCHAR(100) NOT NULL DEFAULT 'probability',
    concept_name VARCHAR(100) DEFAULT 'Probability',
    
    -- Hook Section (Hardcoded for MVP)
    hook_title VARCHAR(255) DEFAULT 'Why Probability Matters at Poker Night',
    hook_content TEXT NOT NULL,
    
    -- Example Section (Basketball focused)
    example_title VARCHAR(255) DEFAULT 'Basketball Connection: The Clutch Shot Decision',
    example_scenario TEXT NOT NULL,
    example_visual TEXT,
    
    -- Approach Section
    approach_title VARCHAR(255) DEFAULT 'Academic Approach: Decision Tree Analysis',
    approach_steps JSONB NOT NULL, -- Array of steps
    approach_formula TEXT,
    
    -- Non-Example Section
    nonexample_title VARCHAR(255) DEFAULT 'When Intuition Fails: The Hero Ball Mistake',
    nonexample_scenario TEXT NOT NULL,
    nonexample_explanation TEXT NOT NULL
);

-- Insert single record for MVP
INSERT INTO concept_content (
    concept_id,
    hook_content,
    example_scenario,
    example_visual,
    approach_steps,
    approach_formula,
    nonexample_scenario,
    nonexample_explanation
) VALUES (
    'probability',
    'At your friend''s blackjack table, every decision you make involves calculating odds. Should you hit on 16? Should you double down? These aren''t just gambling questions – they''re probability in action. Understanding these concepts helps you make smarter decisions, whether you''re at a poker table or making real-life choices.',
    'Imagine you''re the coach with 10 seconds left in the game. Your team is down by 2 points. Your star player has a 45% chance of making a contested 3-pointer, but your reliable forward has a 65% chance of making an open 2-pointer to tie the game. Which play do you call? This is probability theory in action – weighing outcomes based on their likelihood of success.',
    '🏀 45% chance to win vs 65% chance to tie',
    '["Identify all possible outcomes", "Calculate probability of each outcome", "Determine value of each outcome", "Multiply probability × value", "Choose option with highest expected value"]'::jsonb,
    'Optimal Decision = MAX(Σ(Probability × Outcome Value))',
    'Your team is down by 3 with 5 seconds left. Your point guard, who shoots 30% from three, decides to take a contested shot from half-court instead of passing to your center who has a 70% chance of getting fouled and shoots 80% from the line.',
    'This is like hitting on 19 in blackjack – the probability of improving is extremely low (only an Ace or 2 helps), while the probability of busting is very high. Sometimes the "hero play" ignores the math and leads to predictably poor outcomes.'
);

-- 4. Exercises table (Static for MVP)
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    concept_id VARCHAR(100) NOT NULL DEFAULT 'probability',
    exercise_number INTEGER NOT NULL, -- 1 or 2
    title VARCHAR(255) NOT NULL,
    context VARCHAR(100) NOT NULL, -- 'basketball' or 'blackjack'
    scenario TEXT NOT NULL,
    hint TEXT NOT NULL,
    
    -- Expected solution structure
    expected_steps JSONB NOT NULL -- Array of {id, description, key_concept}
);

-- Insert two exercises for MVP
INSERT INTO exercises (concept_id, exercise_number, title, context, scenario, hint, expected_steps) VALUES
('probability', 1, 'The Final Possession', 'basketball', 
 'You''re the point guard with 8 seconds left in the game. Your team is down by 1 point. You have three options: (1) Drive to the basket where you have a 60% chance of scoring but a 20% chance of being blocked, (2) Pull up for a mid-range jumper where you shoot 45%, or (3) Pass to your teammate in the corner who shoots 38% from three but is wide open. What should you do and why?', 
 'Remember to factor in all probabilities including defensive actions. Consider not just the shooting percentage but the complete probability of each outcome.',
 '[
   {"id": "identify_options", "description": "Identify all available plays", "key_concept": "enumerate_outcomes", "order": 1},
   {"id": "calculate_success", "description": "Calculate success probability for each option", "key_concept": "probability_calculation", "order": 2},
   {"id": "factor_defense", "description": "Account for defensive factors (blocking, etc)", "key_concept": "conditional_probability", "order": 3},
   {"id": "compare_options", "description": "Compare expected success rates", "key_concept": "comparison", "order": 4},
   {"id": "make_decision", "description": "Choose option with highest probability", "key_concept": "optimization", "order": 5}
 ]'::jsonb),
('probability', 2, 'The Blackjack Dilemma', 'blackjack',
 'You''re playing blackjack and have 15 (a 10 and a 5). The dealer is showing a 7. You need to decide whether to hit (take another card) or stand (keep your current total). In a standard deck, what''s the probability of improving your hand without busting if you hit? Should you hit or stand?',
 'Count how many cards would help you (6 or under) versus how many would make you bust (7 or higher). Remember there are 13 different card values in a deck.',
 '[
   {"id": "assess_hand", "description": "Evaluate current hand strength", "key_concept": "current_state", "order": 1},
   {"id": "count_helpful", "description": "Count cards that improve without busting", "key_concept": "favorable_outcomes", "order": 2},
   {"id": "count_harmful", "description": "Count cards that cause bust", "key_concept": "unfavorable_outcomes", "order": 3},
   {"id": "calculate_prob", "description": "Calculate probability of improvement", "key_concept": "probability_ratio", "order": 4},
   {"id": "compare_stand", "description": "Compare to probability of winning if standing", "key_concept": "alternative_comparison", "order": 5},
   {"id": "decide_action", "description": "Choose action with better odds", "key_concept": "decision_making", "order": 6}
 ]'::jsonb);

-- 5. Exercise attempts table
CREATE TABLE exercise_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id),
    
    -- Response
    student_response TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Evaluation Status
    is_complete BOOLEAN DEFAULT FALSE,
    needs_remediation BOOLEAN DEFAULT FALSE,
    
    -- Remediation Tracking
    is_remediation_attempt BOOLEAN DEFAULT FALSE,
    parent_attempt_id UUID REFERENCES exercise_attempts(id),
    remediation_round INTEGER DEFAULT 0
);

CREATE INDEX idx_attempts_user ON exercise_attempts(user_id);
CREATE INDEX idx_attempts_thread ON exercise_attempts(thread_id);
CREATE INDEX idx_attempts_parent ON exercise_attempts(parent_attempt_id);

-- 6. Step evaluations table
CREATE TABLE step_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES exercise_attempts(id) ON DELETE CASCADE,
    
    -- Step Details
    step_id VARCHAR(50) NOT NULL, -- From expected_steps
    step_description TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    
    -- Evaluation
    was_addressed BOOLEAN NOT NULL,
    student_articulation TEXT,
    is_correct BOOLEAN NOT NULL,
    
    -- For remediation
    needs_remediation BOOLEAN DEFAULT FALSE,
    is_first_incorrect BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_evaluations_attempt ON step_evaluations(attempt_id);
CREATE INDEX idx_evaluations_remediation ON step_evaluations(needs_remediation);

-- 7. Remediation contexts table
CREATE TABLE remediation_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_attempt_id UUID REFERENCES exercise_attempts(id),
    target_step_id VARCHAR(50) NOT NULL,
    
    -- Enhanced explanation for the problematic step
    step_explanation TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    common_mistake TEXT NOT NULL,
    
    -- Connection back to full problem
    how_it_fits TEXT NOT NULL,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_remediation_attempt ON remediation_contexts(parent_attempt_id);

-- ================================================
-- INSERT SAMPLE THREAD DATA
-- ================================================

-- Insert a sample thread for MVP (after users are created via auth)
-- This would typically be done after a user signs up
-- INSERT INTO threads (
--     user_id,
--     title,
--     situation_title,
--     situation_description,
--     concepts,
--     primary_skill_focus,
--     current_concept_id
-- ) VALUES (
--     (SELECT id FROM users LIMIT 1), -- Would use actual user_id
--     'Making Smart Decisions at Poker Night',
--     'Poker Night Decision Making',
--     'You''re at your weekly poker night with friends. The stakes aren''t high, but you want to make smart decisions. You''re wondering how to think about the odds and make better choices throughout the evening.',
--     '[{"id": "probability", "name": "Probability", "relevance": 0.95}]'::jsonb,
--     '{"skill": "Decision Making Under Uncertainty", "description": "Learn to calculate odds and make optimal choices when outcomes are uncertain"}'::jsonb,
--     'probability'
-- );

-- ================================================
-- CREATE HELPER FUNCTION
-- ================================================

-- Function to evaluate student response (simplified for MVP)
CREATE OR REPLACE FUNCTION evaluate_exercise_attempt(attempt_id UUID) 
RETURNS TABLE(needs_remediation BOOLEAN, first_incorrect_step VARCHAR) AS $$
DECLARE
    exercise_steps JSONB;
    student_response TEXT;
    step JSONB;
    first_incorrect VARCHAR;
    step_index INTEGER := 0;
BEGIN
    -- Get exercise steps and student response
    SELECT e.expected_steps, ea.student_response
    INTO exercise_steps, student_response
    FROM exercise_attempts ea
    JOIN exercises e ON e.id = ea.exercise_id
    WHERE ea.id = attempt_id;
    
    -- Evaluate each step
    FOR step IN SELECT * FROM jsonb_array_elements(exercise_steps)
    LOOP
        step_index := step_index + 1;
        
        INSERT INTO step_evaluations (
            attempt_id,
            step_id,
            step_description,
            step_order,
            was_addressed,
            is_correct,
            is_first_incorrect
        ) VALUES (
            attempt_id,
            step->>'id',
            step->>'description',
            COALESCE((step->>'order')::int, step_index),
            -- Simple check: does response mention key concept?
            student_response ILIKE '%' || (step->>'key_concept') || '%',
            -- Would use LLM in production
            student_response ILIKE '%' || (step->>'key_concept') || '%',
            first_incorrect IS NULL AND NOT (student_response ILIKE '%' || (step->>'key_concept') || '%')
        );
        
        -- Track first incorrect
        IF first_incorrect IS NULL AND NOT (student_response ILIKE '%' || (step->>'key_concept') || '%') THEN
            first_incorrect := step->>'id';
        END IF;
    END LOOP;
    
    -- Update attempt with evaluation results
    UPDATE exercise_attempts 
    SET needs_remediation = (first_incorrect IS NOT NULL),
        is_complete = (first_incorrect IS NULL)
    WHERE id = attempt_id;
    
    RETURN QUERY SELECT first_incorrect IS NOT NULL, first_incorrect;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- SAMPLE QUERIES (Comments for reference)
-- ================================================

-- Get User's Current Progress for a Thread
-- SELECT 
--     e.exercise_number,
--     e.title,
--     ea.is_complete,
--     ea.remediation_round
-- FROM exercises e
-- LEFT JOIN exercise_attempts ea ON ea.exercise_id = e.id 
--     AND ea.user_id = $1 
--     AND ea.thread_id = $2
-- WHERE ea.id = (
--     SELECT MAX(id) FROM exercise_attempts 
--     WHERE exercise_id = e.id AND user_id = $1 AND thread_id = $2
-- )
-- ORDER BY e.exercise_number;

-- Get Thread with Current Concept
-- SELECT 
--     t.*,
--     cc.concept_name,
--     cc.hook_content,
--     cc.example_scenario
-- FROM threads t
-- LEFT JOIN concept_content cc ON cc.concept_id = t.current_concept_id
-- WHERE t.id = $1 AND t.user_id = $2;

-- ================================================
-- GRANT PERMISSIONS (for Supabase)
-- ================================================

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE step_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_contexts ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own threads" ON threads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own threads" ON threads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads" ON threads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view concept content" ON concept_content
    FOR SELECT USING (true);

CREATE POLICY "Anyone can view exercises" ON exercises
    FOR SELECT USING (true);

CREATE POLICY "Users can view own attempts" ON exercise_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own attempts" ON exercise_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own evaluations" ON step_evaluations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM exercise_attempts 
            WHERE exercise_attempts.id = step_evaluations.attempt_id 
            AND exercise_attempts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own remediation contexts" ON remediation_contexts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM exercise_attempts 
            WHERE exercise_attempts.id = remediation_contexts.parent_attempt_id 
            AND exercise_attempts.user_id = auth.uid()
        )
    );
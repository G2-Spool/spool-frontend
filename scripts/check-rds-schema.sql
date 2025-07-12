-- Script to check what tables and columns actually exist in RDS database-1

-- List all tables in the database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if threads table exists and show its columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'threads'
ORDER BY ordinal_position;

-- Check if learning_threads table exists and show its columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'learning_threads'
ORDER BY ordinal_position;

-- Check if learning_paths table exists and show its columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'learning_paths'
ORDER BY ordinal_position;

-- Check for any thread-related tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name LIKE '%thread%' OR table_name LIKE '%learning%')
ORDER BY table_name;
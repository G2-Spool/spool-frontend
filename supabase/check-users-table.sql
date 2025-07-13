-- Check if users table exists and has the interests column
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns 
WHERE 
    table_name = 'users'
    AND table_schema = 'public'
ORDER BY 
    ordinal_position;

-- Check if there are any users in the table
SELECT 
    COUNT(*) as user_count 
FROM 
    public.users;

-- Show a sample user (if any exist)
SELECT 
    id, 
    email, 
    interests,
    created_at
FROM 
    public.users
LIMIT 5; 
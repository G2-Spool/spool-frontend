# Spool Platform - Supabase Architecture

## Overview

The Spool Thread-based learning platform is built entirely on Supabase infrastructure, providing a seamless, scalable solution for personalized education. Our architecture leverages:

1. **Database**: Supabase PostgreSQL with Row Level Security (RLS)
2. **Compute**: Supabase Edge Functions for serverless AI processing
3. **Authentication**: Supabase Auth for secure user management
4. **Storage**: Supabase Storage for media and document handling
5. **Real-time**: Supabase Realtime for live updates

## Database Schema

### Core Tables
- **users**: Core authentication data (managed by Supabase Auth)
- **student_profiles**: Student information and preferences
- **learning_threads**: Multi-disciplinary learning journeys
- **thread_concepts**: Individual concepts within threads
- **thread_sections**: Organizational units within threads
- **thread_branches**: Alternative learning paths
- **assessments**: Quizzes and exercises
- **student_progress**: Progress tracking
- **community_shares**: Social learning features
- **textbooks**: Educational content
- **portfolio_items**: Student work showcases

### Supabase Features Used
- Row Level Security (RLS) for data protection
- PostgreSQL triggers for automated workflows
- Real-time subscriptions for live updates
- Database functions for complex operations

## Edge Functions

### Core Functions
1. **interest-discovery**: Chat-based student interest discovery
2. **thread-discovery**: Extract learning goals from conversations  
3. **thread-generation**: Generate personalized learning threads
4. **content-assembly**: Assemble content for concepts
5. **exercise-generation**: Create personalized exercises
6. **progress-tracking**: Track student achievements

### Integration
- All functions use OpenAI GPT-4 for AI capabilities
- Shared CORS configuration for consistent security
- Supabase client for database operations
- TypeScript with Deno runtime

## Authentication

### Supabase Auth Features
- Email/password authentication
- OAuth providers (Google, GitHub)
- JWT tokens for secure API access
- Row Level Security integration
- Custom user metadata

### User Roles
- **Students**: Primary users with learning profiles
- **Teachers**: Content creators and moderators (future)
- **Parents**: Progress monitoring (future)

## Storage Architecture

### Supabase Storage Buckets
- **avatars**: User profile images
- **portfolio-media**: Student project files
- **thread-resources**: Learning materials
- **exercise-assets**: Images for exercises

### Security
- Bucket-level access policies
- Signed URLs for temporary access
- Integration with RLS

## Benefits of Supabase Architecture

1. **Unified Platform**: All services in one place
2. **Real-time Capabilities**: Built-in websocket support
3. **Scalability**: Automatic scaling with usage
4. **Security**: RLS and auth out of the box
5. **Developer Experience**: Excellent SDK and documentation
6. **Cost Efficiency**: Pay-as-you-go pricing

## API Endpoints

All API access goes through Supabase's auto-generated endpoints:
- REST API: `https://[project-ref].supabase.co/rest/v1/`
- Realtime: `wss://[project-ref].supabase.co/realtime/v1/`
- Edge Functions: `https://[project-ref].supabase.co/functions/v1/`

## Development Workflow

1. **Local Development**: Use Supabase CLI for local testing
2. **Database Changes**: Manage through migrations
3. **Edge Functions**: Deploy with `supabase functions deploy`
4. **Environment Variables**: Stored in Supabase dashboard

## Monitoring and Analytics

- Supabase Dashboard for usage metrics
- Edge Function logs for debugging
- Database query performance monitoring
- Real-time connection monitoring

## Security Best Practices

1. **RLS Policies**: Enforced on all tables
2. **API Keys**: Anon key for public access, service key secured
3. **CORS**: Configured for production domains
4. **Input Validation**: In Edge Functions and database
5. **Rate Limiting**: Built-in Supabase protections

The Supabase architecture provides a modern, scalable foundation for the Spool learning platform with built-in security, real-time features, and excellent developer experience. 
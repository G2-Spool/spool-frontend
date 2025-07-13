#!/bin/bash

# Deploy all Supabase Edge Functions
# Make sure to run 'supabase login' first

echo "🚀 Deploying Supabase Edge Functions..."

# Ensure shared directory exists
if [ ! -d "functions/_shared" ]; then
  echo "❌ Error: _shared directory not found. Please ensure functions/_shared/cors.ts exists."
  exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI is not installed. Please install it first."
    echo "Visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Get the project URL from environment or prompt
if [ -z "$SUPABASE_PROJECT_URL" ]; then
    echo "Please set SUPABASE_PROJECT_URL environment variable"
    echo "Example: export SUPABASE_PROJECT_URL=https://your-project.supabase.co"
    exit 1
fi

# Get the anon key from environment or prompt
if [ -z "$SUPABASE_ANON_KEY" ]; then
    echo "Please set SUPABASE_ANON_KEY environment variable"
    echo "You can find this in your Supabase project settings"
    exit 1
fi

# Functions to deploy
FUNCTIONS=(
    "interest-discovery"
    "thread-discovery"
    "thread-generation"
    "content-assembly"
    "exercise-generation"
    "progress-tracking"
)

# Deploy each function
for FUNCTION in "${FUNCTIONS[@]}"; do
    echo ""
    echo "Deploying $FUNCTION..."
    
    # Check if function directory exists
    if [ ! -d "functions/$FUNCTION" ]; then
        echo "Error: Function directory functions/$FUNCTION not found"
        continue
    fi
    
    # Deploy the function
    supabase functions deploy $FUNCTION \
        --project-ref ${SUPABASE_PROJECT_URL#https://} \
        --no-verify-jwt
    
    if [ $? -eq 0 ]; then
        echo "✅ $FUNCTION deployed successfully"
    else
        echo "❌ Failed to deploy $FUNCTION"
    fi
done

echo ""
echo "Deployment complete!"
echo ""
echo "Edge Function URLs:"
for FUNCTION in "${FUNCTIONS[@]}"; do
    echo "- $FUNCTION: $SUPABASE_PROJECT_URL/functions/v1/$FUNCTION"
done

echo ""
echo "Remember to set the following secrets in your Supabase project:"
echo "- OPENAI_API_KEY"
echo ""
echo "You can set secrets using:"
echo "supabase secrets set OPENAI_API_KEY=your-api-key --project-ref ${SUPABASE_PROJECT_URL#https://}" 
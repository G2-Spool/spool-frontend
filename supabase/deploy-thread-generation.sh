#!/bin/bash

# Deploy thread-generation edge function to Supabase

echo "Deploying thread-generation edge function..."

# Deploy the function
supabase functions deploy thread-generation \
  --project-ref ubtwzfbtfekmgvswlfsd

if [ $? -eq 0 ]; then
  echo "✅ thread-generation edge function deployed successfully!"
else
  echo "❌ Failed to deploy thread-generation edge function"
  exit 1
fi

echo ""
echo "Deployment complete!"
echo "The edge function is now available at:"
echo "https://ubtwzfbtfekmgvswlfsd.supabase.co/functions/v1/thread-generation" 
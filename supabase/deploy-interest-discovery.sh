#!/bin/bash

# Deploy the interest-discovery edge function to Supabase

echo "Deploying interest-discovery edge function..."

# Deploy the function
npx supabase functions deploy interest-discovery --no-verify-jwt

echo "✅ Interest discovery function deployed successfully!"
echo ""
echo "To view logs, run:"
echo "npx supabase functions logs interest-discovery" 
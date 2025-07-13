// supabase/functions/_shared/cors.ts
// These are the Cross-Origin Resource Sharing (CORS) headers.
// They are required to allow a web browser on a different domain (like your local machine
// or your deployed frontend) to make requests to your Supabase Edge Functions.
export const corsHeaders = {
  // 'Access-Control-Allow-Origin' specifies which origins are allowed to access the resource.
  // Using '*' is permissive and great for development, as it allows requests from any origin.
  // For production, you should restrict this to your specific front-end domain for better security.
  // Example for production: 'https://www.your-app-domain.com'
  'Access-Control-Allow-Origin': '*',
  // 'Access-Control-Allow-Headers' specifies which headers can be used in the actual request.
  // We need to include 'authorization' for the Supabase JWT, 'apikey' for the anon key,
  // and 'content-type' for sending JSON payloads. 'x-client-info' is also used by the Supabase client.
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
}; 
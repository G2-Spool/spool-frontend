import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

// Supabase configuration
const supabaseUrl = 'https://ubtwzfbtfekmgvswlfsd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVidHd6ZmJ0ZmVrbWd2c3dsZnNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTcyODMsImV4cCI6MjA2NzkzMzI4M30.wLGaW0ZucC22cUJiFHrBgmXLCZuVmAg5SjZvb20Rf64'

// Create Supabase client with TypeScript types
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) 
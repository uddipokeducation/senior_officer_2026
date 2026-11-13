import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://nsdjykpnrlxvdfaicqbq.supabase.co'
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zZGp5a3Bucmx4dmRmYWljcWJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ1NzEwNDcsImV4cCI6MjExMDE0NzA0N30.PxjSeODwFnodlSTpHe5dQwH5TkvE3Mk5ONWROwcLG3o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Temporary fallback - this will be replaced by Supabase integration
import { createClient } from '@supabase/supabase-js'

// Temporary placeholder values - the Supabase integration will replace this entire file
const supabaseUrl = 'https://placeholder.supabase.co'
const supabaseAnonKey = 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
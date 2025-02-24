import { createClient } from '@supabase/supabase-js'
import { GLOBAL_CONSTANTS } from '@src/config-global.ts'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  GLOBAL_CONSTANTS.NEXT_PUBLIC_SUPABASE_URL!,
  GLOBAL_CONSTANTS.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

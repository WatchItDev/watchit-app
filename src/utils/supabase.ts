import { createClient } from '@supabase/supabase-js';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';

const supabaseUrl = GLOBAL_CONSTANTS.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = GLOBAL_CONSTANTS.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);

import { describe, it, expect } from 'vitest';
import { GLOBAL_CONSTANTS } from '@src/config-global.ts';
import { supabase } from '@src/utils/supabase.ts';

describe('Supabase Client', () => {
  it('should create a supabase client with mocked URL and anon key', () => {
    expect(GLOBAL_CONSTANTS.NEXT_PUBLIC_SUPABASE_URL).toBe(
      'https://mock.supabase.co',
    );
    expect(GLOBAL_CONSTANTS.NEXT_PUBLIC_SUPABASE_ANON_KEY).toBe(
      'mock-anon-key',
    );
    expect(supabase).toBeDefined();
  });
});

import { createClient } from '@supabase/supabase-js';

import { SUPABASE_ANON_KEY, SUPABASE_CONFIG_OK, SUPABASE_URL } from './supabaseConfig';

export { SUPABASE_CONFIG_OK } from './supabaseConfig';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

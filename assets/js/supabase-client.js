import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.1/+esm';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

const hasUrl = Boolean(SUPABASE_URL) && !SUPABASE_URL.includes('YOUR_PROJECT');
const hasKey = Boolean(SUPABASE_ANON_KEY) && !SUPABASE_ANON_KEY.includes('YOUR_SUPABASE_ANON_KEY');

export const SUPABASE_CONFIG_OK = Boolean(hasUrl && hasKey);
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

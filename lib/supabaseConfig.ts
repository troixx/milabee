export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://kvqctzorgtprmdrzkcdr.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2cWN0em9yZ3Rwcm1kcnprY2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwMzI0MTEsImV4cCI6MjA4MjYwODQxMX0.LB9fbr641qZYeaSyRQ1StwEIV2y2LD2_zgAACn5pEcw';

const hasUrl = Boolean(SUPABASE_URL);
const hasKey = Boolean(SUPABASE_ANON_KEY);

export const SUPABASE_CONFIG_OK = hasUrl && hasKey;

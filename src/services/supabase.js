import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://liwvkflxgbseaamrvgks.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxpd3ZrZmx4Z2JzZWFhbXJ2Z2tzIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1NDY2NTEsImV4cCI6MjAwNTEyMjY1MX0.wTi1olkMPVBtJdf31ZzPCTtLqKwQunqcU8MW4YoPfCU';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

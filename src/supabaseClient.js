import { createClient } from '@supabase/supabase-js'

// Paste your own Supabase URL and anon key below
const supabaseUrl = 'https://cegczrwjalpzmwnrsaak.supabase.co';
const supabaseAnonKey = 'sb_publishable_xZWhBkKNbOS8mxzPD9mOkw_NFnIqZhR';

// This creates the connection and exports it for our app to use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
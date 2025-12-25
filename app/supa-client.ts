import { createClient } from '@supabase/supabase-js';
import type { Database as SupabaseDatabase } from '../database.types.ts';

export type Database = SupabaseDatabase;

const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default client;

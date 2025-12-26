import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/types/database';

export const getEvents = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('events').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/types/database';

export const getEvents = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.rpc('get_latest_unique_events');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

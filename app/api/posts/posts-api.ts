import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/supa-client';

export const getPosts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('posts').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

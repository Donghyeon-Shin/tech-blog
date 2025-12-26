import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/supa-client';

export const getPosts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('posts').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getPostById = async (client: SupabaseClient<Database>, id: number) => {
  const { data, error } = await client.from('posts').select('*').eq('post_id', id).single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

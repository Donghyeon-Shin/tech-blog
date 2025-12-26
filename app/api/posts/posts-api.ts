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

const PAGE_SIZE = 5; // 한 페이지에 보여줄 글 개수

export const getPostsByCategoryAndPage = async (
  client: SupabaseClient<Database>,
  categoryId: number,
  page: number,
) => {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = client
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (categoryId !== -1) {
    query = query.eq('tag', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPostTotalPagesByCategoryAndPage = async (
  client: SupabaseClient<Database>,
  categoryId: number,
) => {
  let query = client.from('posts').select('*', { count: 'exact', head: true });

  if (categoryId !== -1) {
    query = query.eq('tag', categoryId);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return Math.ceil((count || 0) / PAGE_SIZE);
};

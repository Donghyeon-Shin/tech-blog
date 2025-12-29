import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/types/database';

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

  const { error: rpcError } = await client.rpc('increment_post_view', { target_post_id: id });

  if (rpcError) {
    throw new Error(rpcError.message);
  }

  return data;
};

export const getAllPostsForOverview = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from('posts')
    .select('post_id, title, read_time, view_count')
    .order('view_count', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getViewCountByTag = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.rpc('get_view_count_by_tag');

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
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
    .from('posts_with_excerpt')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (categoryId !== -1) {
    query = query.eq('tag_id', categoryId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPopularPostsWithExcerpt = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from('posts_with_excerpt')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(5);
  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPostTotalPagesByCategory = async (
  client: SupabaseClient<Database>,
  categoryId: number,
) => {
  let query = client.from('posts_with_excerpt').select('*', { count: 'exact', head: true });

  if (categoryId !== -1) {
    query = query.eq('tag_id', categoryId);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return Math.ceil((count || 0) / PAGE_SIZE);
};

export const getPopularPosts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('view_count', { ascending: false })
    .limit(5);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getAllPostsForBuildingCategoriesTree = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('posts').select('post_id, title, category_id');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '~/types/database';

export const getCategories = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('categories').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getTopLevelCategories = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.from('categories').select('*').is('parent_id', null);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getMonthlyViewCountByCategory = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.rpc('get_monthly_view_count_by_category', {
    year_month: new Date().toISOString().split('T')[0],
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getDailyViewCountByCategory = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.rpc('get_daily_view_count_by_category', {
    target_date: new Date().toISOString().split('T')[0],
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getCategoriesGroupedByViewCount = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client.rpc('get_categories_grouped_by_view_count');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

CREATE OR REPLACE FUNCTION public.get_daily_view_count_by_category(target_date date)
RETURNS TABLE(tag_id bigint, category_name text, record_date date, daily_view_count bigint)
LANGUAGE sql
SECURITY definer
SET search_path = ''
AS $$
  SELECT 
    ps.category_id::bigint as tag_id,
    c.name::text as category_name,
    ps.record_date::date as record_date,
    SUM(ps.daily_view_count)::bigint as daily_view_count
  FROM public.post_stats ps
  INNER JOIN public.categories c ON ps.category_id = c.category_id
  WHERE ps.record_date >= target_date - INTERVAL '6 days'
    AND ps.record_date <= target_date
  GROUP BY ps.category_id, c.name, ps.record_date
  ORDER BY ps.record_date DESC, ps.category_id;
$$;
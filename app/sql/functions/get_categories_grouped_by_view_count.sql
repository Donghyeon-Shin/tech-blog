CREATE OR REPLACE FUNCTION public.get_categories_grouped_by_view_count()
RETURNS TABLE(tag_id bigint, category_name text, total_view_count bigint)
LANGUAGE sql
SECURITY definer
SET search_path = ''
AS $$
  SELECT 
    ps.category_id::bigint as tag_id,
    c.name::text as category_name,
    SUM(ps.daily_view_count)::bigint as total_view_count
  FROM public.post_stats ps
  INNER JOIN public.categories c ON ps.category_id = c.category_id
  GROUP BY ps.category_id, c.name
  ORDER BY total_view_count DESC;
$$;
CREATE OR REPLACE FUNCTION public.get_view_count_by_tag()
RETURNS TABLE(tag_id bigint, category_name text, year_month text, view_count bigint)
LANGUAGE sql
SECURITY definer
SET search_path = ''
AS $$
  SELECT 
    ps.category_id::bigint as tag_id,       -- 최상위 ID가 들어있으므로 바로 사용
    c.name::text as category_name,
    TO_CHAR(ps.record_date, 'YYYY-MM')::text as year_month,
    SUM(ps.daily_view_count)::bigint as view_count
  FROM public.post_stats ps
  INNER JOIN public.categories c ON ps.category_id = c.category_id
  WHERE ps.record_date >= CURRENT_DATE - INTERVAL '1 year'
  GROUP BY ps.category_id, c.name, TO_CHAR(ps.record_date, 'YYYY-MM')
  ORDER BY year_month DESC, tag_id DESC;
$$;
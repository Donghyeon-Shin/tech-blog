CREATE OR REPLACE FUNCTION public.get_monthly_view_count_by_category(year_month text)
RETURNS TABLE(tag_id bigint, category_name text, record_date text, total_view_count bigint)
LANGUAGE sql
SECURITY definer
SET search_path = ''
AS $$
  SELECT 
    ps.category_id::bigint as tag_id,
    c.name::text as category_name,
    TO_CHAR(ps.record_date, 'YYYY-MM')::text as year_month,
    SUM(ps.daily_view_count)::bigint as total_view_count
  FROM public.post_stats ps
  INNER JOIN public.categories c ON ps.category_id = c.category_id
  WHERE ps.record_date >= (TO_DATE(year_month, 'YYYY-MM') - INTERVAL '1 year')
    AND ps.record_date < TO_DATE(year_month, 'YYYY-MM') + INTERVAL '1 month'
  GROUP BY ps.category_id, c.name, TO_CHAR(ps.record_date, 'YYYY-MM')
  ORDER BY TO_CHAR(ps.record_date, 'YYYY-MM') DESC, ps.category_id;
$$;
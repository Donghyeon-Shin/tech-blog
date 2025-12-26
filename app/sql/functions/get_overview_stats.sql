CREATE OR REPLACE FUNCTION public.get_overview_stats()
RETURNS TABLE(total_posts bigint, total_views bigint, total_read_time bigint, total_tags bigint)
LANGUAGE sql
SECURITY definer
SET search_path = ''
AS $$
  SELECT 
    COUNT(*)::bigint as total_posts,
    COALESCE(SUM(view_count), 0)::bigint as total_views,
    COALESCE(SUM(read_time), 0)::bigint as total_read_time,
    COUNT(DISTINCT tag)::bigint as total_tags
  FROM public.posts;
$$;


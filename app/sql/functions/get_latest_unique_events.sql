CREATE OR REPLACE FUNCTION public.get_latest_unique_events()
RETURNS TABLE(event_id bigint, event_type event_types, post_id bigint, created_at timestamp, post_title text, post_excerpt text)
LANGUAGE plpgsql
SECURITY definer
SET search_path = ''
AS $$
BEGIN
    RETURN QUERY
    SELECT e.event_id, e.event_type, e.post_id, e.created_at, p.title, p.excerpt FROM 
    (
      SELECT DISTINCT ON (events.post_id) *
      FROM public.events
      ORDER BY events.post_id, events.created_at DESC
    ) e
    JOIN public.posts_with_excerpt p ON e.post_id = p.post_id
    ORDER BY e.created_at DESC
    LIMIT 3;
END;
$$;
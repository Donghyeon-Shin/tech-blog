CREATE OR REPLACE FUNCTION public.increment_post_view(target_post_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY definer
SET search_path = ''
AS $$
BEGIN
    UPDATE public.posts
    SET view_count = view_count + 1
    WHERE post_id = target_post_id;
END;
$$;
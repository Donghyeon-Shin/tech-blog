CREATE OR REPLACE FUNCTION public.update_post_daily_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer
SET search_path = ''
AS $$
BEGIN
    IF ( OLD.view_count IS DISTINCT FROM NEW.view_count ) THEN
        INSERT INTO public.post_stats AS ps (post_id, category_id, daily_view_count, record_date) 
        VALUES (
            NEW.post_id, 
            NEW.category_id, 
            1, 
            NOW()
        )
        ON CONFLICT (post_id, record_date) 
        DO UPDATE SET daily_view_count = ps.daily_view_count + 1;
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER post_stats_trigger
AFTER UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_post_daily_stats();
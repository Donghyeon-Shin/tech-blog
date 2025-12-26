CREATE OR REPLACE FUNCTION public.log_post_event()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY definer
SET search_path = ''
AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.events (event_type, post_id, created_at) VALUES ('create', NEW.post_id, NOW());
    ELSEIF (TG_OP = 'UPDATE') THEN
        IF (OLD.title IS DISTINCT FROM NEW.title OR 
                OLD.content IS DISTINCT FROM NEW.content OR
                OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
          INSERT INTO public.events (event_type, post_id, created_at) VALUES ('update', NEW.post_id, NOW());
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$;

CREATE TRIGGER post_event_trigger
AFTER INSERT OR UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.log_post_event();
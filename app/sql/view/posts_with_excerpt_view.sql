CREATE OR REPLACE VIEW posts_with_excerpt AS
SELECT 
  post_id,
  title,
  tag,
  created_at,
  read_time,
  view_count,
  substring(content, 1, 100) as excerpt
FROM posts;
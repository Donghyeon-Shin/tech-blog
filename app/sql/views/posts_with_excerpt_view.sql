CREATE OR REPLACE VIEW posts_with_excerpt AS
SELECT 
  post_id,
  title,
  tag_id,
  category_id,
  created_at,
  read_time,
  view_count,
  substring(content, 1, 300) as excerpt
FROM posts;

SELECT * FROM posts_with_excerpt;
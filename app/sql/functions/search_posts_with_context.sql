create or replace function search_posts_with_context(search_term text)
returns table (
  post_id int8,
  title text,
  found_in_title boolean, -- 제목에서 찾았는지 여부
  context_snippet text,   -- 본문 내 검색어 주변 문맥
  rank float4
) 
language sql
as $$
  select
    post_id,
    title,
    -- 제목에 키워드가 포함되었는지 확인
    (to_tsvector('simple', title) @@ plainto_tsquery('simple', search_term)) as found_in_title,
    -- 본문에서 키워드 주변 10단어 내외를 추출하고 검색어는 <b> 태그로 강조
    ts_headline('simple', content, plainto_tsquery('simple', search_term), 
      'StartSel=<b>, StopSel=</b>, MaxWords=30, MinWords=15, MaxFragments=1') as context_snippet,
    ts_rank(to_tsvector('simple', title || ' ' || content), plainto_tsquery('simple', search_term)) as rank
  from posts
  where to_tsvector('simple', title || ' ' || content) @@ plainto_tsquery('simple', search_term)
  order by rank desc;
$$;

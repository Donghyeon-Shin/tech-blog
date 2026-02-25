import { getPosts } from '~/api/posts/posts-api';
import { client } from '~/supa-client';

const BASE_URL = 'https://dongle-portfolio.org/';

function buildUrl(path: string) {
  return `${BASE_URL}${path}`;
}

// 필요하다면 Supabase에서 최신 products / jobs / posts 몇 개 가져와서 여기에 섞어줄 수 있음
export async function loader() {
  // 1) 정적 페이지들
  const staticPaths = [
    '/', // 홈
    '/posts/all',
    '/popular',
    '/about',
    '/dashboard',
  ];

  // 2) 게시글 목록
  const posts = await getPosts(client);
  const postPaths = posts.map((post) => `/post/${encodeURIComponent(post.title)}`);

  const urls = [...staticPaths, ...postPaths].map((path) => buildUrl(path));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   ${urls
     .map(
       (loc) => `<url>
         <loc>${loc}</loc>
       </url>`,
     )
     .join('\n')}
   </urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

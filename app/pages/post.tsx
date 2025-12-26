import { Calendar, Clock } from 'lucide-react';
import HierarchyBar from '~/components/layout/hierarchyBar';
import { Separator } from '~/components/ui/separator';
import { format } from 'date-fns';
import MarkdownrRender from '~/components/layout/markdownrRender';
import { useRef, useState } from 'react';
import PostSidebar from '~/components/layout/postSideBar';
import type { Route } from './+types/post';
import type { ShouldRevalidateFunctionArgs } from 'react-router';
import GitHubSlugger from 'github-slugger';
import client from '~/supa-client';
import { getPostById } from '~/api/posts/posts-api';

export const loader = async ({ request: _request }: Route.LoaderArgs) => {
  const url = new URL(_request.url);
  const id = url.pathname.split('/')[2];
  const post = await getPostById(client, parseInt(id));

  const markdownContent = post.content;

  // 마크다운 텍스트에서 TOC 생성
  const slugger = new GitHubSlugger();
  const lines = markdownContent.split('\n');
  let inCodeBlock = false;
  const toc = lines
    .filter((line) => {
      const trimmed = line.trim();
      // 코드 블록 시작/끝 감지
      if (trimmed.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return false;
      }
      // 코드 블록 안에 있으면 제외
      if (inCodeBlock) {
        return false;
      }
      // 헤더만 포함
      return trimmed.startsWith('#');
    })
    .map((line) => {
      const level = line.split('#').length - 1;
      const text = line.replace(/#/g, '').trim();
      const id = slugger.slug(text);
      return { level, text, id };
    });

  return { toc, post, markdownContent };
};

export const shouldRevalidate = ({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) => {
  // 동일한 post_id에 대한 요청인지 확인
  const currentPostId = currentUrl.pathname.split('/')[2];
  const nextPostId = nextUrl.pathname.split('/')[2];

  // 같은 게시글이면 캐시 재사용 (false 반환)
  if (currentPostId === nextPostId) {
    return false;
  }

  // 다른 게시글이면 재검증 (true 반환)
  return true;
};

export default function Post({ loaderData }: Route.ComponentProps) {
  const { toc, post, markdownContent } = loaderData;
  const dbData = new Date(post.created_at);
  const formattedDate = format(dbData, 'MMM dd, yyyy');
  const minutesToRead = post.read_time; // TODO: 실제 읽는 시간 계산 분초로

  const [activeId, setActiveId] = useState<string>('');

  const isScrollingRef = useRef(false);

  // 옵저버용 함수 (플래그가 false일 때만 상태 변경)
  const handleObserverActiveId = (id: string) => {
    if (!isScrollingRef.current) {
      setActiveId(id);
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-[1fr_280px] xl:grid-cols-[1fr_280px]'>
      <div className='flex flex-col gap-4 mx-3'>
        <HierarchyBar
          hierarchy={[
            { category: 'Algorithm' },
            { category: 'Array' },
            { category: 'Binary Search' },
          ]}
        />
        <h1 className='text-6xl font-bold'>{post.title}</h1>
        <div className='flex items-center justify-end gap-5'>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Calendar className='size-4' />
            <span className='text-sm font-medium'>{formattedDate}</span>
          </div>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <Clock className='size-4' />
            <span className='text-sm font-medium'>{minutesToRead} min read</span>
          </div>
        </div>
        <Separator />
        {/* 본문 내용 렌더링 */}
        <MarkdownrRender content={markdownContent} setActiveId={handleObserverActiveId} />
      </div>
      <div className='sticky top-20 hidden md:block self-start'>
        <PostSidebar
          activeId={activeId}
          setActiveId={setActiveId}
          isScrollingRef={isScrollingRef}
          toc={toc}
        />
      </div>
    </div>
  );
}

import { Calendar, Clock } from 'lucide-react';
import HierarchyBar from '~/components/layout/hierarchyBar';
import { Separator } from '~/components/ui/separator';
import { format } from 'date-fns';
import MarkdownHtmlRender from '~/components/layout/markdownHtmlRender';
import { useMemo, useRef, useState } from 'react';
import PostSidebar from '~/components/layout/postSideBar';
import type { Route } from './+types/post';
import type { ShouldRevalidateFunctionArgs } from 'react-router';
import GitHubSlugger from 'github-slugger';
import { client } from '~/supa-client';
import { getPostByTitle } from '~/api/posts/posts-api';
import { useOutletContext } from 'react-router';
import { markdownToHtml } from '~/lib/markdown-to-html';
import type { getCategories } from '~/api/categories/categories-api';
import { z } from 'zod';

export const meta: Route.MetaFunction = ({ loaderData }: Route.MetaArgs) => {
  return [
    { title: `${loaderData.post.title} | Dongle` },
    { name: 'description', content: `Post page of Blog ${loaderData.post.title}` },
  ];
};

const paramsSchema = z.object({
  title: z.string(),
});

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Response('Invalid post ID', { status: 400 });
  }

  const post = await getPostByTitle(client, data.title);

  if (!post) {
    throw new Response('Post not found', { status: 404 });
  }

  const markdownContent = post.content;

  // 서버 사이드에서 마크다운을 HTML로 변환
  const htmlContent = await markdownToHtml(markdownContent);

  // 마크다운 텍스트에서 TOC 생성
  const slugger = new GitHubSlugger();
  const lines = markdownContent.split('\n');
  let inCodeBlock = false;
  const toc = lines
    .filter((line: string) => {
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
    .map((line: string) => {
      const level = line.split('#').length - 1;
      const text = line.replace(/#/g, '').trim();
      const id = slugger.slug(text);
      return { level, text, id };
    });

  return { toc, post, htmlContent };
};

export const shouldRevalidate = ({ currentParams, nextParams }: ShouldRevalidateFunctionArgs) => {
  // 동일한 post title에 대한 요청인지 확인
  const currentTitle = currentParams?.title;
  const nextTitle = nextParams?.title;

  // 같은 게시글이면 캐시 재사용 (false 반환)
  if (currentTitle === nextTitle) {
    return false;
  }

  // 다른 게시글이면 재검증 (true 반환)
  return true;
};

export default function Post({ loaderData }: Route.ComponentProps) {
  const { toc, post, htmlContent } = loaderData;
  const dbData = new Date(post.created_at);
  const formattedDate = format(dbData, 'MMM dd, yyyy');
  const minutesToRead = post.read_time; // TODO: 실제 읽는 시간 계산 분초로

  const { allCategories } = useOutletContext<{
    allCategories: Awaited<ReturnType<typeof getCategories>>;
  }>();

  // 현재 post의 카테고리 경로 구성 (최상위부터 현재까지)
  const categoryPath = useMemo(() => {
    if (!post.category_id || !allCategories) return [];

    const path: { category: string }[] = [];
    const categoryMap = new Map(allCategories.map((c) => [c.category_id, c]));

    // 현재 카테고리부터 시작해서 부모를 따라 올라가기
    let currentCategoryId: number | null = post.category_id;

    while (currentCategoryId !== null) {
      const category = categoryMap.get(currentCategoryId);
      if (!category) break;

      path.unshift({ category: category.name }); // 앞에 추가하여 최상위가 먼저 오도록
      currentCategoryId = category.parent_id;
    }

    // 마지막에 현재 post 제목 추가
    path.push({ category: post.title });

    return path;
  }, [post.category_id, post.title, allCategories]);

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
        <HierarchyBar hierarchy={categoryPath} />
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
        <MarkdownHtmlRender
          htmlContent={htmlContent}
          setActiveId={handleObserverActiveId}
          isScrollingRef={isScrollingRef}
        />
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

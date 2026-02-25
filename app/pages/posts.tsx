import { NavLink, redirect, useOutletContext, type MetaFunction } from 'react-router';
import type { Route } from './+types/posts';
import { cva } from 'class-variance-authority';
import PostCard from '~/components/ui/postCard';
import PostPagination from '~/components/layout/postPagination';
import { markdownToText } from '~/lib/markdown-to-text';
import {
  getPostsByCategoryAndPage,
  getPostsCount,
  getPostTotalPagesByCategory,
} from '~/api/posts/posts-api';
import type { getTopLevelCategories } from '~/api/categories/categories-api';
import { z } from 'zod';
import { client } from '~/supa-client';

export const meta: MetaFunction = () => {
  return [
    { title: 'All Posts | Dongle' },
    { name: 'description', content: 'Posts page of Blog with all posts and categories' },
  ];
};

const paramsSchema = z.object({
  category: z
    .string()
    .optional()
    .default('all')
    .refine(
      (val) => {
        if (val === 'all' || !val) return true;
        const num = parseInt(val, 10);
        return !isNaN(num);
      },
      {
        message: 'Category must be "all" or a valid number',
      },
    ),
});

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { success, data } = paramsSchema.safeParse(params);
  if (!success) {
    throw new Response('Invalid category parameter', { status: 404 });
  }

  const categoryValue =
    data.category === 'all' || !data.category ? -1 : parseInt(data.category, 10);

  // 쿼리 파라미터에서 page 읽기 및 검증
  const url = new URL(request.url);
  const pageParam = url.searchParams.get('page');
  const pageNum = pageParam ? parseInt(pageParam, 10) : 1;

  // 병렬 실행
  const [totalPages, posts, totalPosts] = await Promise.all([
    getPostTotalPagesByCategory(client, categoryValue),
    getPostsByCategoryAndPage(client, categoryValue, pageNum),
    getPostsCount(client),
  ]);

  // 게시글이 없는 경우 404 에러 발생
  if (posts.length === 0) {
    throw new Response('No posts found', { status: 404 });
  }

  // 페이지 범위를 벗어난 경우에만 리다이렉트
  if (pageNum < 1 || (totalPages > 0 && pageNum > totalPages)) {
    return redirect(`/posts/${params.category || 'all'}?page=1`);
  }

  const postsWithProcessedExcerpt = posts.map((post) => ({
    ...post,
    processedExcerpt: markdownToText(post.excerpt || '', 300),
  }));

  return {
    totalPages,
    postsWithProcessedExcerpt,
    totalPosts,
  };
};

const navLinkVariants = cva('rounded-full border px-4 py-1 text-sm md:text-base', {
  variants: {
    isActive: {
      true: 'bg-foreground font-medium text-background',
      false: 'hover:bg-primary/10',
    },
  },
});

export default function Posts({ loaderData }: Route.ComponentProps) {
  const { topLevelCategories } = useOutletContext<{
    topLevelCategories: Awaited<ReturnType<typeof getTopLevelCategories>>;
  }>();
  const { postsWithProcessedExcerpt, totalPages, totalPosts } = loaderData;

  return (
    <div className='flex flex-col min-h-[calc(100vh-4rem)] max-w-[1400px] xl:ml-20'>
      <div className='flex flex-col gap-8 flex-1'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-3xl md:text-4xl font-bold'>All Posts</h1>
          <p className='text-muted-foreground'>
            A collection of {totalPosts} articles on programming, technology and life.
          </p>
        </div>
        <div className='flex flex-row flex-wrap gap-2'>
          <NavLink
            to='/posts/all'
            prefetch='intent'
            className={({ isActive }) => navLinkVariants({ isActive })}
          >
            View All
          </NavLink>
          {topLevelCategories?.map((category) => (
            <NavLink
              key={category.category_id}
              to={`/posts/${category.category_id}`}
              prefetch='intent'
              className={({ isActive }) => navLinkVariants({ isActive })}
            >
              {category.name}
            </NavLink>
          ))}
        </div>
        <div className='flex flex-col gap-4'>
          {postsWithProcessedExcerpt.map((post) => {
            const postWithExcerpt = post as typeof post & { processedExcerpt?: string };
            return (
              <PostCard
                key={post.post_id}
                title={post.title}
                description={postWithExcerpt.processedExcerpt || post.excerpt || ''}
                categoryName={
                  (topLevelCategories?.find((c) => c.category_id === post.tag_id)
                    ?.name as string) || 'null'
                }
                date={new Date(post.created_at)}
                readTime={post.read_time}
              />
            );
          })}
        </div>
      </div>
      <div className='mt-auto pt-8'>
        <PostPagination totalPages={totalPages} />
      </div>
    </div>
  );
}

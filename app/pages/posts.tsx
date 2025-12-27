import { NavLink, useOutletContext } from 'react-router';
import type { Route } from './+types/posts';
import { cva } from 'class-variance-authority';
import PostCard from '~/components/ui/postCard';
import PostPagination from '~/components/layout/postPagination';
import { useMemo } from 'react';
import { markdownToText } from '~/lib/markdown-to-text';
import type { getAllPostsForFiltering } from '~/api/posts/posts-api';
import type { getCategories } from '~/api/categories/categories-api';
const PAGE_SIZE = 5; // 한 페이지에 보여줄 글 개수

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const categoryId = parseInt(url.pathname.split('/')[2]) || -1;
  const page = parseInt(url.searchParams.get('page') || '1') || 1;

  return { categoryId, page };
};

const navLinkVariants = cva('rounded-full border px-4 py-1', {
  variants: {
    isActive: {
      true: 'bg-foreground font-medium text-background',
      false: 'hover:bg-primary/10',
    },
  },
});

export default function Posts({ loaderData }: Route.ComponentProps) {
  const { categoryId, page } = loaderData;
  const { posts, categories } = useOutletContext<{
    posts: Awaited<ReturnType<typeof getAllPostsForFiltering>>;
    categories: Awaited<ReturnType<typeof getCategories>>;
  }>();

  const { posts: filteredPosts, totalPages } = useMemo(() => {
    let result = posts;
    if (categoryId !== -1) {
      result = posts.filter((p) => p.tag_id === categoryId);
    }

    const totalPages = Math.ceil(result.length / PAGE_SIZE);

    const paginatedPosts = result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // markdownToText를 한 번만 계산
    const postsWithProcessedExcerpt = paginatedPosts.map((post) => ({
      ...post,
      processedExcerpt: markdownToText(post.excerpt || '', 300),
    }));

    return {
      posts: postsWithProcessedExcerpt,
      totalPages,
    };
  }, [posts, categoryId, page]);

  return (
    <div className='flex flex-col min-h-[calc(100vh-4rem)] max-w-[1400px] md:ml-20'>
      <div className='flex flex-col gap-8 flex-1'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-4xl font-bold'>All Posts</h1>
          <p className='text-muted-foreground'>
            A collection of 42 articles on programming, technology and life.
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
          {categories?.map((category) => (
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
          {filteredPosts.map((post) => {
            const postWithExcerpt = post as typeof post & { processedExcerpt?: string };
            return (
              <PostCard
                key={post.title}
                title={post.title}
                description={postWithExcerpt.processedExcerpt || post.excerpt || ''}
                categoryName={
                  (categories?.find((c) => c.category_id === post.tag_id)?.name as string) || 'null'
                }
                date={new Date(post.created_at)}
                link={`/post/${post.post_id}`}
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

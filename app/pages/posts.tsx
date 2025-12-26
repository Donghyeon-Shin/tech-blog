import { NavLink } from 'react-router';
import type { Route } from './+types/posts';
import type { ShouldRevalidateFunctionArgs } from 'react-router';
import { cva } from 'class-variance-authority';
import PostCard from '~/components/ui/postCard';
import PostPagination from '~/components/layout/postPagination';
import { getAllPostsForFiltering } from '~/api/posts/posts-api';
import client from '~/supa-client';
import { useMemo } from 'react';
import { getTopLevelCategories } from '~/api/categories/categories-api';

const PAGE_SIZE = 5; // 한 페이지에 보여줄 글 개수

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const categoryId = parseInt(url.pathname.split('/')[2]) || -1;
  const page = parseInt(url.searchParams.get('page') || '1') || 1;

  const posts = await getAllPostsForFiltering(client);
  const categories = await getTopLevelCategories(client);

  return { posts, categories, categoryId, page };
};

export const shouldRevalidate = ({ currentUrl, nextUrl }: ShouldRevalidateFunctionArgs) => {
  // 동일한 카테고리와 페이지인지 확인
  const currentPath = currentUrl.pathname;
  const nextPath = nextUrl.pathname;
  const currentPage = currentUrl.searchParams.get('page') || '1';
  const nextPage = nextUrl.searchParams.get('page') || '1';

  // 같은 경로와 페이지면 캐시 재사용 (false 반환)
  if (currentPath === nextPath && currentPage === nextPage) {
    return false;
  }

  // 다른 카테고리나 페이지면 재검증 (true 반환)
  return true;
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
  const { posts, categories, categoryId, page } = loaderData;

  const { posts: filteredPosts, totalPages } = useMemo(() => {
    let result = posts;
    if (categoryId !== -1) {
      result = posts.filter((p) => p.tag === categoryId);
    }

    const totalPages = Math.ceil(result.length / PAGE_SIZE);
    return { posts: result.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), totalPages };
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
          {filteredPosts.map((post) => (
            <PostCard
              key={post.title}
              title={post.title}
              description={post.excerpt}
              categoryName={categories?.find((c) => c.category_id === post.tag)?.name as string}
              date={new Date(post.created_at)}
              link={`/post/${post.post_id}`}
              readTime={post.read_time}
            />
          ))}
        </div>
      </div>
      <div className='mt-auto pt-8'>
        <PostPagination totalPages={totalPages} />
      </div>
    </div>
  );
}

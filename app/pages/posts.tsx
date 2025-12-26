import { NavLink } from 'react-router';
import type { Route } from './+types/posts';
import { cva } from 'class-variance-authority';
import PostCard from '~/components/ui/postCard';
import PostPagination from '~/components/layout/postPagination';
import {
  getPostsByCategoryAndPage,
  getPostTotalPagesByCategoryAndPage,
} from '~/api/posts/posts-api';
import client from '~/supa-client';
import { getTopLevelCategories } from '~/api/categories/categories-api';

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const categoryIdParam = url.pathname.split('/')[2];
  const pageParam = url.searchParams.get('page') || '1';

  // "all"인 경우 -1로 변환, 그 외에는 숫자로 변환
  const categoryId = categoryIdParam === 'all' ? -1 : parseInt(categoryIdParam, 10);
  const page = parseInt(pageParam, 10) || 1;

  // categoryId가 유효한 숫자가 아니면 -1로 설정
  const validCategoryId = isNaN(categoryId) ? -1 : categoryId;

  const categories = await getTopLevelCategories(client);
  const posts = await getPostsByCategoryAndPage(client, validCategoryId, page);

  const totalPages = await getPostTotalPagesByCategoryAndPage(client, validCategoryId);

  return { posts, totalPages, categories };
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
  const { totalPages, posts, categories } = loaderData;

  return (
    <div className='flex flex-col gap-8 max-w-[1400px] md:ml-20'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>All Posts</h1>
        <p className='text-muted-foreground'>
          A collection of 42 articles on programming, technology and life.
        </p>
      </div>
      <div className='flex flex-row flex-wrap gap-2'>
        <NavLink to='/posts/all' className={({ isActive }) => navLinkVariants({ isActive })}>
          View All
        </NavLink>
        {categories?.map((category) => (
          <NavLink
            key={category.category_id}
            to={`/posts/${category.category_id}`}
            className={({ isActive }) => navLinkVariants({ isActive })}
          >
            {category.name}
          </NavLink>
        ))}
      </div>
      <div className='flex flex-col gap-4'>
        {posts.map((post) => (
          <PostCard
            key={post.title}
            title={post.title}
            description={post.content.slice(0, 100)}
            categoryName={categories?.find((c) => c.category_id === post.tag)?.name as string}
            date={new Date(post.created_at)}
            link={`/post/${post.post_id}`}
            readTime={post.read_time}
          />
        ))}
      </div>
      <PostPagination totalPages={totalPages} />
    </div>
  );
}

import { NavLink, useOutletContext, type MetaFunction } from 'react-router';
import PopularPostCard from '~/components/ui/popularPostCard';
import { markdownToText } from '~/lib/markdown-to-text';
import { getPopularPostsWithExcerpt } from '~/api/posts/posts-api';
import type { getTopLevelCategories } from '~/api/categories/categories-api';
import type { CategoryName } from '~/lib/category-config';
import { client } from '~/supa-client';
import type { Route } from './+types/popularPosts';

export const meta: MetaFunction = () => {
  return [
    { title: 'Popular Posts | Dongle' },
    { name: 'description', content: 'Popular posts page of Blog with most read articles' },
  ];
};

export const loader = async () => {
  const popularPosts = await getPopularPostsWithExcerpt(client);
  return { popularPosts };
};

export default function PopularPosts({ loaderData }: Route.ComponentProps) {
  const { topLevelCategories } = useOutletContext<{
    topLevelCategories: Awaited<ReturnType<typeof getTopLevelCategories>>;
  }>();
  const { popularPosts } = loaderData;

  return (
    <div className='flex flex-col gap-8 max-w-[1400px] md:ml-20'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-3xl md:text-4xl font-bold'>Popular Posts</h1>
        <p className='text-muted-foreground'>Most read articles on my blog</p>
      </div>
      <div className='flex flex-col gap-4'>
        {popularPosts.map((post, index) => (
          <PopularPostCard
            key={post.post_id}
            title={post.title}
            description={markdownToText(post.excerpt || '', 300)}
            category={
              (topLevelCategories?.find((c) => c.category_id === post.tag_id)
                ?.name as CategoryName) || 'null'
            }
            date={new Date(post.created_at)}
            views={post.view_count}
            readTime={post.read_time}
            rank={index + 1}
          />
        ))}
      </div>

      <div className='flex items-center justify-center'>
        <NavLink
          to='/posts/all'
          className='text-sm text-muted-foreground hover:text-foreground border rounded-full p-4'
        >
          Load More Articles
        </NavLink>
      </div>
    </div>
  );
}

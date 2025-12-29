import { NavLink, useOutletContext } from 'react-router';
import PopularPostCard from '~/components/ui/popularPostCard';
import { useMemo } from 'react';
import { markdownToText } from '~/lib/markdown-to-text';
import type { getAllPostsForFiltering } from '~/api/posts/posts-api';
import type { getCategories } from '~/api/categories/categories-api';
import type { CategoryName } from '~/lib/category-config';

export default function PopularPosts() {
  const { posts, categories } = useOutletContext<{
    posts: Awaited<ReturnType<typeof getAllPostsForFiltering>>;
    categories: Awaited<ReturnType<typeof getCategories>>;
  }>();
  const { popularPosts } = useMemo(() => {
    const sortedPosts = [...posts].sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    const popularPosts = sortedPosts.slice(0, 5);
    return { popularPosts };
  }, [posts]);
  return (
    <div className='flex flex-col gap-8 max-w-[1400px] md:ml-20'>
      <div className='flex flex-col gap-4'>
        <h1 className='text-4xl font-bold'>Popular Posts</h1>
        <p className='text-muted-foreground'>Most read articles on my blog</p>
      </div>
      <div className='flex flex-col gap-4'>
        {popularPosts.map((post, index) => (
          <PopularPostCard
            key={post.title}
            title={post.title}
            description={markdownToText(post.excerpt || '', 300)}
            category={
              (categories.find((c) => c.category_id === post.tag_id)?.name as CategoryName) ||
              'null'
            }
            date={new Date(post.created_at)}
            link={`/post/${post.post_id}`}
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
